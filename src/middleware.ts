import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// Let NextAuth handle its own internal routes automatically
export { default } from "next-auth/middleware";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const { pathname } = req.nextUrl;

  const isAuthPage =
    pathname.startsWith("/sign-in") ||
    pathname.startsWith("/sign-up");

  const isProtectedPage = pathname.startsWith("/dashboard");

  // -------------------------------------------
  // 🚫 1. If logged in and trying to open sign-in or sign-up → send to dashboard
  // -------------------------------------------
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // -------------------------------------------
  // 🚫 2. If NOT logged in and trying to open dashboard → go to sign-in
  // -------------------------------------------
  if (!token && isProtectedPage) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // -------------------------------------------
  // ✔ 3. Allow all other routes normally
  // -------------------------------------------
  return NextResponse.next();
}

// -------------------------------------------
// 🔥 Only protect dashboard routes
// -------------------------------------------
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/sign-in",
    "/sign-up",
  ],
};
