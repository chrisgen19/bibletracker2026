import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  console.log("[MIDDLEWARE] Checking auth for:", request.nextUrl.pathname);

  const token = await getToken({ req: request, secret: process.env.AUTH_SECRET });

  console.log("[MIDDLEWARE] Token found:", !!token);
  if (token) {
    console.log("[MIDDLEWARE] Token user:", { email: token.email, id: token.id });
  }

  if (!token) {
    console.log("[MIDDLEWARE] No token, redirecting to login");
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  console.log("[MIDDLEWARE] Auth successful, allowing access");
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
