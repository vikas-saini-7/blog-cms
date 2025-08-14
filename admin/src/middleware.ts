// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // If user is logged in and trying to access "/", redirect to dashboard
    if (token && pathname === "/") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // If user is NOT logged in and tries to access /dashboard, redirect to "/"
    if (!token && pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // Just check if user is logged in for protected routes
      authorized: ({ token }) => true, // Let middleware handle redirects
    },
  }
);

export const config = {
  matcher: ["/", "/dashboard/:path*"], // Only check these routes
};
