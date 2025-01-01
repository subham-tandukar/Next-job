import { dbQuery } from "@/lib/db/mysql";
import {
  handleErrorResponse,
  handleSuccessResponse,
} from "../../../../utils/apiResponse";

import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: "dhug9dlwn",
  api_key: "722976334683785",
  api_secret: "tVYx2gMBNHb0fIjEmlHcDgMGNnA",
});

// Function to sanitize the category name for the public_id
const sanitizePublicId = (categoryName) => {
  // Replace spaces with underscores and remove other invalid characters
  return categoryName
    .replace(/\s+/g, "_") // Replace spaces with underscores
    .replace(/[^\w\s\-]/g, "") // Remove any non-alphanumeric or non-underscore/dash characters
    .toLowerCase(); // Optional: convert to lowercase
};

const folderName = "categories";

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const catId = url.searchParams.get("id");
    const status = url.searchParams.get("status");

    if (catId) {
      // Retrieve a single category
      const query = `SELECT * FROM category WHERE id = ?`;
      const [category] = await dbQuery(query, [catId]);

      if (!category) {
        return handleErrorResponse(new Error("Category not found"), 404);
      }

      return handleSuccessResponse(
        category,
        "Category retrieved successfully",
        200
      );
    } else {
      // Retrieve all categories (with optional status filtering)
      let query = `SELECT * FROM category`;
      const values = [];

      if (status === "0") {
        values.push(status);
      } else if (status) {
        query += ` WHERE status = ?`;
        values.push(status);
      }

      const rows = await dbQuery(query, values);

      return handleSuccessResponse(
        rows,
        "Categories retrieved successfully",
        200
      );
    }
  } catch (error) {
    return handleErrorResponse(error, 500);
  }
}

export async function POST(req) {
  try {
    // Parse JSON body
    const { category, status = "1", image } = await req.json();

    // Validate required fields
    if (!category || !image) {
      return handleErrorResponse(
        new Error("Please fill all the required fields"),
        400
      );
    }

    // Check if the category already exists
    const existingCategory = await dbQuery(
      "SELECT id FROM category WHERE category = ?",
      [category]
    );

    if (existingCategory.length > 0) {
      return handleErrorResponse(
        new Error("This category already exists"),
        400
      );
    }

    // Attempt to upload the image to Cloudinary
    let uploadResult;
    try {
      // Sanitize the category name to create a valid public_id
      const publicId = sanitizePublicId(category) + `_${Date.now()}`;

      uploadResult = await cloudinary.uploader.upload(image, {
        folder: folderName, // Optional folder in your Cloudinary account
        public_id: publicId, // Optional: Use category name as public ID
      });
    } catch (uploadError) {
      console.error("Cloudinary upload failed:", uploadError);
      return handleErrorResponse(
        new Error("Image upload failed. Please try again."),
        500
      );
    }

    // Insert the category into the database
    const query = `INSERT INTO category (category, status, image) VALUES (?, ?, ?)`;
    const result = await dbQuery(query, [
      category,
      status,
      uploadResult.secure_url,
    ]);

    return handleSuccessResponse(
      {
        id: result.insertId,
        category,
        status,
        image: uploadResult.secure_url,
      },
      "Category added successfully",
      201
    );
  } catch (error) {
    return handleErrorResponse(error, 500);
  }
}

export async function PATCH(req) {
  try {
    const data = await req.json();
    const catId = data.id;

    // Validate required fields
    if (!data.category || !data.image) {
      return handleErrorResponse(
        new Error("Please fill all the required fields"),
        400
      );
    }

    // Check if category ID is provided
    if (!catId) {
      return handleErrorResponse(new Error("Category ID is required"), 400);
    }

    const allowedFields = ["category", "status"];
    const updates = [];
    const values = [];

    // Iterate through request data to build update queries for category and status
    for (const [key, value] of Object.entries(data)) {
      if (allowedFields.includes(key) && value !== undefined) {
        updates.push(`${key} = ?`);
        values.push(value);
      }
    }

    // If no fields to update, return error
    if (updates.length === 0) {
      return handleErrorResponse(new Error("No fields to update"), 400);
    }

    // Check if category name is being updated and if it already exists
    if (data.category) {
      const checkQuery = `SELECT id FROM category WHERE category = ? AND id != ?`;
      const [existingCat] = await dbQuery(checkQuery, [data.category, catId]);

      if (existingCat) {
        return handleErrorResponse(new Error("Category already exists"), 400);
      }
    }

    // Check if image is provided (in base64 or URL form)
    let newImageUrl = null;
    if (data.image) {
      // Check if the image is in base64 format
      const isBase64 = data.image.startsWith("data:image/");

      if (isBase64) {
        // If image is in base64, upload to Cloudinary and get the URL
        const existingCategory = await dbQuery(
          "SELECT image FROM category WHERE id = ?",
          [catId]
        );

        if (existingCategory.length === 0) {
          return handleErrorResponse(new Error("Category not found"), 404);
        }

        // If the category already has an image, delete it from Cloudinary
        const oldImageUrl = existingCategory[0].image;

        if (oldImageUrl) {
          const publicId = oldImageUrl.split("/").pop().split(".")[0]; // Extract the public ID from the URL

          await cloudinary.uploader.destroy(`${folderName}/${publicId}`); // Delete the old image
        }

        // Sanitize the category name to create a valid public_id
        const publicId = sanitizePublicId(data.category) + `_${Date.now()}`;

        // Upload the new base64 image to Cloudinary
        const uploadResult = await cloudinary.uploader.upload(data.image, {
          folder: folderName, // Optional: folder for organization
          public_id: publicId, // Use category ID as public ID for uniqueness
        });

        // Set the new image URL
        newImageUrl = uploadResult.secure_url;

        // Add image update to the fields
        updates.push("image = ?");
        values.push(newImageUrl);
      }
    }

    // Build the update SQL query
    const query = `UPDATE category SET ${updates.join(", ")} WHERE id = ?`;
    values.push(catId);

    // Execute the update query
    const result = await dbQuery(query, values);

    // If no rows were affected, the category was not found
    if (result.affectedRows === 0) {
      return handleErrorResponse(new Error("Category not found"), 404);
    }

    // Return success response
    return handleSuccessResponse(
      { id: catId, ...data, image: newImageUrl || data.image },
      "Category updated successfully",
      200
    );
  } catch (error) {
    return handleErrorResponse(error, 500);
  }
}

export async function DELETE(req) {
  try {
    const url = new URL(req.url);
    const isBulkDelete = url.searchParams.get("isBulkDelete") === "true";
    const idsParam = url.searchParams.get("id");

    if (!idsParam) {
      return handleErrorResponse(new Error("Category Id is required"), 400);
    }

    if (isBulkDelete) {
      // Bulk delete logic
      const idArray = idsParam.split(",").map((id) => Number(id.trim()));

      if (!idArray.length || idArray.some(isNaN)) {
        return handleErrorResponse(new Error("Invalid category IDs"), 400);
      }

      // Fetch the image URLs for the categories to be deleted
      const imagesToDelete = await dbQuery(
        `SELECT image FROM category WHERE id IN (${idArray
          .map(() => "?")
          .join(",")})`,
        idArray
      );

      if (imagesToDelete.length > 0) {
        // Extract public IDs from the image URLs and delete them from Cloudinary
        for (const { image } of imagesToDelete) {
          if (image) {
            const publicId = image.split("/").pop().split(".")[0]; // Extract the public ID from the URL
            await cloudinary.uploader.destroy(`${folderName}/${publicId}`); // Delete the old image
          }
        }
      }

      const query = `DELETE FROM category WHERE id IN (${idArray
        .map(() => "?")
        .join(",")})`;
      const result = await dbQuery(query, idArray);

      if (result.affectedRows === 0) {
        return handleErrorResponse(
          new Error("No categories found for deletion"),
          404
        );
      }

      return handleSuccessResponse(
        null,
        `${result.affectedRows} categories deleted successfully`,
        200
      );
    } else {
      // Individual delete logic
      const id = Number(idsParam);

      if (isNaN(id)) {
        return handleErrorResponse(new Error("Invalid category ID"), 400);
      }

      const deletedData = await dbQuery(
        `SELECT image FROM category WHERE id = ?`,
        [id]
      );

      if (deletedData.length > 0) {
        const deletedImageUrl = deletedData[0].image;

        if (deletedImageUrl) {
          const publicId = deletedImageUrl.split("/").pop().split(".")[0]; // Extract the public ID from the URL
          await cloudinary.uploader.destroy(`${folderName}/${publicId}`); // Delete the old image
        }
      }

      const query = `DELETE FROM category WHERE id=?`;
      const result = await dbQuery(query, [id]);

      if (result.affectedRows === 0) {
        return handleErrorResponse(new Error("Category not found"), 404);
      }

      return handleSuccessResponse(null, "Category deleted successfully", 200);
    }
  } catch (error) {
    return handleErrorResponse(error, 500);
  }
}
