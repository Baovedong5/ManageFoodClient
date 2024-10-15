import authRequest from "@/app/apiRequests/auth";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const cookieStore = cookies();

  const access_token = cookieStore.get("access_token")?.value;
  cookieStore.delete("access_token");
  cookieStore.delete("refresh_token");

  if (!access_token) {
    return Response.json(
      {
        message: "Không nhận được access token",
      },
      {
        status: 200,
      }
    );
  }

  try {
    const result = await authRequest.sLogout(access_token as string);
    return Response.json(result.payload);
  } catch (error) {
    console.log(error);

    return Response.json(
      {
        message: "Lỗi khi gọi API đến server backend",
      },
      {
        status: 200,
      }
    );
  }
}
