import { NextResponse } from "next/server";
import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

const { auth } = NextAuth(authConfig);

// Routes that don't require authentication
const publicRoutes = [
  "/",
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
  "/changelog",
];

const isPublicRoute = (pathname: string) => {
  if (publicRoutes.includes(pathname)) return true;
  // Allow /u/* public profile routes
  if (pathname.startsWith("/u/")) return true;
  return false;
};

export default auth((request) => {
  const { pathname } = request.nextUrl;
  const isLoggedIn = !!request.auth;
  const emailVerified = request.auth?.user?.emailVerified;

  // Public routes: accessible to everyone
  if (isPublicRoute(pathname)) {
    // Redirect logged-in verified users away from guest-only pages
    const guestOnlyPages = [
      "/",
      "/login",
      "/signup",
      "/forgot-password",
      "/reset-password",
      "/verify-email",
    ];
    if (isLoggedIn && emailVerified && guestOnlyPages.includes(pathname)) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // Not logged in: redirect to login
  if (!isLoggedIn) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Logged in but not verified: redirect to verify-email
  if (!emailVerified) {
    const verifyUrl = new URL("/verify-email", request.url);
    if (request.auth?.user?.email) {
      verifyUrl.searchParams.set("email", request.auth.user.email);
    }
    return NextResponse.redirect(verifyUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/",
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
    "/verify-email",
    "/dashboard/:path*",
    "/profile/:path*",
    "/friends/:path*",
  ],
};
