import { NextRequest, NextResponse } from "next/server";

const privatePaths = ["/manage"];
const unAuthPaths = ["/login"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const access_token = request.cookies.get("access_token")?.value;
  const refresh_token = request.cookies.get("refresh_token")?.value;

  //Chưa đăng nhập thì không cho vào private paths
  if (
    privatePaths.some((path) => pathname.startsWith(path)) &&
    !refresh_token
  ) {
    const url = new URL("/login", request.url);
    url.searchParams.set("clearTokens", "true");
    return NextResponse.redirect(url);
  }

  //Đăng nhập rồi, nhưng access token hết hạn
  if (
    privatePaths.some((path) => pathname.startsWith(path)) &&
    !access_token &&
    refresh_token
  ) {
    const url = new URL("/refresh-token", request.url);
    url.searchParams.set("refresh_token", refresh_token ?? "");
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  //Đăng nhập rồi thì không cho vào login nữa
  if (unAuthPaths.some((path) => pathname.startsWith(path)) && refresh_token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/manage/:path*", "/login"],
};
