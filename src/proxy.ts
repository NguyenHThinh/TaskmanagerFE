import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const REFRESH_COOKIE_NAME = "refreshToken";

const PUBLIC_PATHS = ["/login", "/register"];
const PUBLIC_PREFIXES = ["/_next", "/api", "/favicon", "/404"];

const isPublicPath = (pathname: string): boolean => {
  if (PUBLIC_PATHS.includes(pathname)) return true;
  return PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix));
};

const hasAuthCookie = (request: NextRequest): boolean => {
  return request.cookies.has(REFRESH_COOKIE_NAME);
};

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublicPath(pathname)) {
    if (PUBLIC_PATHS.includes(pathname) && hasAuthCookie(request)) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  if (!hasAuthCookie(request)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
