import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

// 1. Specify protected and public routes
// const protectedRoutes = ["/app"];
const publicRoutes = ["/login", "/signup"];

export default async function middleware(req: NextRequest) {
  // 2. Check if the current route is protected or public
  const path = req.nextUrl.pathname;
  const isPublicRoute = publicRoutes.includes(path);
  // const isProtectedRoute = protectedRoutes.includes(path);
  const isProtectedRoute = !isPublicRoute;

  // 3. Decrypt the session from the cookie
  const cookie = (await cookies()).get("auth_session")?.value;

  // 4. Redirect to /login if the user is not authenticated
  if (isProtectedRoute && !cookie) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // 5. Redirect to main page if the user is authenticated
  if (isPublicRoute && cookie && req.nextUrl.pathname !== "/") {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
