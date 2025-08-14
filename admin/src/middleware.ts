import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Enable logging in production to debug
    console.log("Middleware - pathname:", pathname, "hasToken:", !!token);

    // If user is logged in and trying to access "/", redirect to dashboard
    if (token && pathname === "/") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // If user is NOT logged in and tries to access protected routes, redirect to "/"
    if (!token && pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // Only allow access if token exists for protected routes
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Allow access to login page without token
        if (pathname === "/") {
          return true;
        }

        // For dashboard routes, require token
        if (pathname.startsWith("/dashboard")) {
          return !!token;
        }

        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    // Exclude API routes and static files
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
