import { dbQuery } from "@/lib/db/mysql";
import {
  handleErrorResponse,
  handleSuccessResponse,
} from "../../../../utils/apiResponse";

const bcrypt = require("bcrypt");

// GET method to retrieve all users
export async function GET(req) {
  try {
    const query = `SELECT id, name, email FROM user`;

    const rows = await dbQuery(query);

    return handleSuccessResponse(rows, "User retrieved successfully", 200);
  } catch (error) {
    return handleErrorResponse(error, 500);
  }
}

// POST method to add a new user
export async function POST(req) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return handleErrorResponse(
        new Error("Please fill all the required fields"),
        400
      );
    }

    // Check if email already exists
    const existingUser = await dbQuery("SELECT id FROM user WHERE email = ?", [
      email,
    ]);

    if (existingUser.length > 0) {
      return handleErrorResponse(new Error("This email already exist"), 400);
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const query = `INSERT INTO user (name, email, password) VALUES (?,?,?)`;
    // Insert the user into the database
    const result = await dbQuery(query, [name, email, hashedPassword]);

    return handleSuccessResponse(
      { id: result.insertId, name, email },
      "User created successfully",
      201
    );
  } catch (error) {
    return handleErrorResponse(error, 500);
  }
}

// PATCH method to update a new user
export async function PATCH(req) {
  try {
    const data = await req.json();
    const userId = data.id;

    if (!userId) {
      return handleErrorResponse(new Error("User ID is required"), 400);
    }

    // Extract user data from request

    const allowedFields = ["name", "email"]; // Add more fields here as needed

    // Dynamically build updates and values
    const updates = [];
    const values = [];

    for (const [key, value] of Object.entries(data)) {
      if (allowedFields.includes(key) && value !== undefined) {
        updates.push(`${key} = ?`);
        values.push(value);
      }
    }

    if (updates.length === 0) {
      return handleErrorResponse(new Error("No fields to update"), 400);
    }

    // Check for email duplication only if email is being updated
    if (data.email) {
      const emailCheckQuery = `SELECT id FROM user WHERE email = ? AND id != ?`;
      const [existingUser] = await dbQuery(emailCheckQuery, [
        data.email,
        userId,
      ]);

      if (existingUser) {
        return handleErrorResponse(new Error("Email already exists"), 400);
      }
    }

    const query = `UPDATE user SET ${updates.join(", ")} WHERE id = ?`;
    values.push(userId);

    const result = await dbQuery(query, values);

    if (result.affectedRows === 0) {
      return handleErrorResponse(new Error("User not found"), 404);
    }

    return handleSuccessResponse(
      { id: userId, ...data },
      "User updated successfully",
      200
    );
  } catch (error) {
    return handleErrorResponse(error, 500);
  }
}

// DELETE method to delete a user
export async function DELETE(req) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("id");

    if (!userId) {
      return handleErrorResponse(new Error("User ID is required"), 400);
    }

    const query = `DELETE FROM user WHERE id = ?`;

    const result = await dbQuery(query, [userId]);

    if (result.affectedRows === 0) {
      return handleErrorResponse(new Error("User not found"), 404);
    }

    return handleSuccessResponse(null, "User deleted successfully", 200);
  } catch (error) {
    return handleErrorResponse(error, 500);
  }
}
