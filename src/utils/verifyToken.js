import jwt from "jsonwebtoken";

export async function middleware(req) {
  const token = req.headers.get("Authorization")?.split(" ")[1];

  if (!token) {
    return new Response(
      JSON.stringify({ error: "Authorization token is required" }),
      { status: 401 }
    );
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // Attach user data for use in the route
  } catch (error) {
    return new Response(JSON.stringify({ error: "Invalid or expired token" }), {
      status: 403,
    });
  }
}
