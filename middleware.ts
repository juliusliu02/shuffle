import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME } from "@/server/utils/cookie";

// 1. Specify protected and public routes
const publicRoutes = ["/login", "/signup"];

export default async function middleware(req: NextRequest) {
  // 2. Check if the current route is protected or public
  const path = req.nextUrl.pathname;
  const isPublicRoute = publicRoutes.includes(path);

  // 3. Get the session from the cookie
  const cookie = (await cookies()).get(SESSION_COOKIE_NAME)?.value;

  // 4. Redirect to /login if the user is not authenticated
  if (!isPublicRoute && !cookie) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // 5. Redirect to main page if the user is authenticated
  if (isPublicRoute && cookie) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
