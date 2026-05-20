import { NextResponse } from "next/server";

const AUTH_ROUTES = ["/login", "/sign-up"];
const PROTECTED_ROUTES = ["/dashboard", "/create-profile"];

export function middleware(req) {
  const token = req.cookies.get("access_token")?.value;
  const { pathname } = req.nextUrl;

  const isAuthRoute = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  const isProtectedRoute = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/sign-up",
    "/verification",
    "/forgot-password",
    "/reset-password",
    "/agreements",
    "/create-profile",
    "/dashboard",
    "/dashboard/:path*",
  ],
};
