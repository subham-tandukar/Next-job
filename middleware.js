import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function middleware(request) {
    const session = await getServerSession(authOptions);

    // Check if the request is to an admin route
    const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');

    if (isAdminRoute && !session) {
        // If user is not logged in and trying to access an admin route, redirect to login
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (!isAdminRoute && session) {
        // If user is logged in and tries to access a non-admin route, redirect to admin dashboard
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }

    // If the user is logged in and accessing an admin route or not logged in and accessing a non-admin route, allow the request
    return NextResponse.next();
}

// Specify the paths to apply the middleware
export const config = {
    matcher: ['/admin/:path*', '/login/:path*'], // Apply to all admin and login routes
};
