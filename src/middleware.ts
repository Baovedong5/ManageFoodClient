import { NextRequest, NextResponse } from "next/server";

const privatePaths = ["/manage"];
const unAuthPaths = ["/login"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuth = Boolean(request.cookies.get("access_token")?.value);

  //Chưa đăng nhập thì không cho vào private paths
  if (privatePaths.some((path) => pathname.startsWith(path)) && !isAuth) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  //Đăng nhập rồi thì không cho vào login nữa
  if (unAuthPaths.some((path) => pathname.startsWith(path)) && isAuth) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/manage/:path*", "/login"],
};
