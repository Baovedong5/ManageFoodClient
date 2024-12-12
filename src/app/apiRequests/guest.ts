import http from "@/lib/http";
import {
  RefreshTokenBodyType,
  RefreshTokenResType,
} from "@/schemaValidations/auth.schema";
import {
  GuestCreateOrdersBodyType,
  GuestCreateOrdersResType,
  GuestGetOrdersResType,
  GuestLoginBodyType,
  GuestLoginResType,
} from "@/schemaValidations/guest.schema";
import {
  PaymentGuestVnPayBodyType,
  PaymentGuestVnPayResType,
} from "@/schemaValidations/order.schema";

const guestApi = {
  refreshTokenRequest: null as Promise<{
    status: number;
    payload: RefreshTokenResType;
  }> | null,

  sLogin: (body: GuestLoginBodyType) =>
    http.post<GuestLoginResType>("/guests/auth/login", body),
  login: (body: GuestLoginBodyType) =>
    http.post<GuestLoginResType>("/api/guest/auth/login", body, {
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

  sRefreshToken: (body: RefreshTokenBodyType) =>
    http.post<RefreshTokenResType>("/guests/auth/refresh-token", body),

  async refreshToken() {
    if (this.refreshTokenRequest) {
      return this.refreshTokenRequest;
    }
    this.refreshTokenRequest = http.post<RefreshTokenResType>(
      "/api/guest/auth/refresh-token",
      null,
      {
        baseUrl: "",
      }
    );
    const result = await this.refreshTokenRequest;
    this.refreshTokenRequest = null;
    return result;
  },
  order: (body: GuestCreateOrdersBodyType) =>
    http.post<GuestCreateOrdersResType>("/guests/orders", body),
  getOrderList: () => http.get<GuestGetOrdersResType>("/guests/orders"),
  paymentVnpay: (body: PaymentGuestVnPayBodyType) =>
    http.post<PaymentGuestVnPayResType>("/guests/payment-vnpay", body),
};

export default guestApi;
