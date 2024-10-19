import authRequest from "@/app/apiRequests/auth";
import { LoginBodyType } from "@/schemaValidations/auth.schema";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { HttpError } from "@/lib/http";

export async function POST(request: Request) {
  const body = (await request.json()) as LoginBodyType;

  const cookieStore = cookies();

  try {
    const { payload } = await authRequest.sLogin(body);
    const { access_token, refresh_token } = payload.data;

    const decodedAccessToken = jwt.decode(access_token) as { exp: number };
    const decodedRefreshToken = jwt.decode(refresh_token) as { exp: number };

    cookieStore.set("access_token", access_token, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      expires: decodedAccessToken.exp * 1000,
    });

    cookieStore.set("refresh_token", refresh_token, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      expires: decodedRefreshToken.exp * 1000,
    });

    console.log(cookieStore);

    return Response.json(payload);
  } catch (error) {
    console.log(error);

    if (error instanceof HttpError) {
      return Response.json(error.payload, {
        status: error.status,
      });
    } else {
      return Response.json(
        {
          message: "Có lỗi xảy ra",
        },
        {
          status: 500,
        }
      );
    }
  }
}
