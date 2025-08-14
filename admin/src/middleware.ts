import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isAuthPage = req.nextUrl.pathname === "/";
    const isDashboardPage = req.nextUrl.pathname.startsWith("/dashboard");

    console.log(token);

    // If user is authenticated and tries to access login page (/), redirect to dashboard
    if (isAuthPage && isAuth) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // If user is not authenticated and tries to access dashboard, redirect to login (/)
    if (isDashboardPage && !isAuth) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: () => true, // Allow middleware to run for all requests
    },
  }
);

export const config = {
  matcher: ["/", "/dashboard/:path*"],
};
