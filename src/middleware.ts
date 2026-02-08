import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export default auth((request) => {
  console.log("[MIDDLEWARE] Checking auth for:", request.nextUrl.pathname);

  if (!request.auth) {
    console.log("[MIDDLEWARE] No session, redirecting to login");
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  console.log("[MIDDLEWARE] Auth successful, allowing access");
  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*"],
};
