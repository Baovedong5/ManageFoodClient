import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import guestApi from "@/app/apiRequests/guest";

export async function POST(request: Request) {
  const cookieStore = cookies();
  const refresh_token = cookieStore.get("refresh_token")?.value;

  if (!refresh_token) {
    return Response.json(
      {
        message: "Không tìm thấy refresh token",
      },
      {
        status: 401,
      }
    );
  }

  try {
    const { payload } = await guestApi.sRefreshToken({
      refresh_token,
    });

    console.log(payload);

    const decodedAccessToken = jwt.decode(payload.data.access_token) as {
      exp: number;
    };
    const decodedRefreshToken = jwt.decode(payload.data.refresh_token) as {
      exp: number;
    };

    cookieStore.set("access_token", payload.data.access_token, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      expires: decodedAccessToken.exp * 1000,
    });

    cookieStore.set("refresh_token", payload.data.refresh_token, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      expires: decodedRefreshToken.exp * 1000,
    });

    return Response.json(payload);
  } catch (error: any) {
    console.log(error);

    return Response.json(
      {
        message: error.message ?? "Có lỗi xảy ra",
      },
      {
        status: 401,
      }
    );
  }
}
