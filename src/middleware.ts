import { NextRequest, NextResponse } from "next/server";
import { decodeToken } from "./lib/utils";
import { Role } from "./constants/type";
import path from "path";

const managePaths = ["/manage"];
const guestePaths = ["/guest"];
const privatePaths = [...managePaths, ...guestePaths];
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

  // Trường hợp đã đăng nhập
  if (refresh_token) {
    //Nếu cố tình vào trang login
    if (unAuthPaths.some((path) => pathname.startsWith(path))) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    //nhưng access token hết hạn
    if (
      privatePaths.some((path) => pathname.startsWith(path)) &&
      !access_token
    ) {
      const url = new URL("/refresh-token", request.url);
      url.searchParams.set("refreshToken", refresh_token);
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }

    //Vào không đúng role redirect về trang chủ
    const role = decodeToken(refresh_token).role;
    //Guest nhưng cố vào router owner
    const isGuestGoToManagePath =
      role === Role.Guest &&
      managePaths.some((path) => pathname.startsWith(path));
    //Không phải guest nhưng cố vào router guest
    const isNotGuestGoToGuestPath =
      role !== Role.Guest &&
      guestePaths.some((path) => pathname.startsWith(path));
    if (isGuestGoToManagePath || isNotGuestGoToGuestPath) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/manage/:path*", "/guest/:path*", "/login"],
};
