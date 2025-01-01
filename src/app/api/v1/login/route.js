import { dbQuery } from "@/lib/db/mysql";
import {
  handleErrorResponse,
  handleSuccessResponse,
} from "../../../../utils/apiResponse";
const { JWT_SECRET } = process.env;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return handleErrorResponse(
        new Error("Email and password are required"),
        400
      );
    }

    // Check if the user exists
    const users = await dbQuery("SELECT * FROM user WHERE email = ?", [email]);

    if (users.length === 0) {
      return handleErrorResponse(
        new Error("These credentials do not match our records"),
        400
      );
    }

    const user = users[0];

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return handleErrorResponse(
        new Error("These credentials do not match our records"),
        400
      );
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id, email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    return handleSuccessResponse(
      { id: user.id, name: user.name, email, token },
      "Login successful",
      200
    );
  } catch (error) {
    return handleErrorResponse(error, 500);
  }
}
