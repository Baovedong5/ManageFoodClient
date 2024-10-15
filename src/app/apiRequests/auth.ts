import { LoginBodyType, LoginResType } from "@/schemaValidations/auth.schema";
import http from "@/lib/http";

const authRequest = {
  sLogin: (body: LoginBodyType) => http.post<LoginResType>("/auth/login", body),
  login: (body: LoginBodyType) =>
    http.post<LoginResType>("/api/auth/login", body, {
      baseUrl: "",
    }),
  sLogout: (access_token: string) =>
    http.post("/auth/logout", null, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }),
  logout: () =>
    http.post("/api/auth/logout", null, {
      baseUrl: "",
    }),
};

export default authRequest;
