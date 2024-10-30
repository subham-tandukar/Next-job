import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request) {
  // Decode JWT to check if user is authenticated
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  console.log("Token from getToken:", token); // Should display token or null
  console.log("Request Path:", request.nextUrl.pathname);
  
  // Determine if the request is for an admin route
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");

  if (isAdminRoute && !token) {
    // If user is not authenticated and trying to access an admin route, redirect to login
    return NextResponse.rewrite(new URL("/login", request.url));
  }

  // Allow request if user is authenticated or it's not an admin route
  return NextResponse.next();
}

// Configure matcher for middleware
export const config = {
  matcher: ["/admin/:path*"], // Apply middleware only to admin routes
};
