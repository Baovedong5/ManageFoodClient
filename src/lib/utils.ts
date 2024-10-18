import { clsx, type ClassValue } from "clsx";
import { UseFormSetError } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { EntityError } from "@/lib/http";
import { toast } from "@/hooks/use-toast";
import jwt from "jsonwebtoken";
import authRequest from "@/app/apiRequests/auth";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Xóa đi ký tự `/` đầu tiên của path
 */
export const normalizePath = (path: string) => {
  return path.startsWith("/") ? path.slice(1) : path;
};

export const handleErrorApi = ({
  error,
  setError,
  duration,
}: {
  error: any;
  setError?: UseFormSetError<any>;
  duration?: number;
}) => {
  if (error instanceof EntityError && setError) {
    const message = error.payload.message;
    const field = error.payload.field;
    console.log(message);

    if (Array.isArray(message)) {
      message.forEach((item) => {
        setError(item, {
          type: "server",
          message: item,
        });
      });
    } else {
      setError(field, {
        type: "server",
        message: message,
      });
    }
  } else {
    toast({
      title: "Lỗi",
      description: error?.payload?.message ?? "Lỗi không xác định",
      variant: "destructive",
      duration: duration ?? 5000,
    });
  }
};

const isBrowser = typeof window !== "undefined";
export const getAccessTokenFromLocalStorage = () =>
  isBrowser ? localStorage.getItem("access_token") : null;

export const getRefreshTokenFromLocalStorage = () =>
  isBrowser ? localStorage.getItem("refresh_token") : null;

export const setAccessTokenToLocalStorage = (value: string) =>
  isBrowser && localStorage.setItem("access_token", value);

export const setRefreshTokenToLocalStorage = (value: string) =>
  isBrowser && localStorage.setItem("refresh_token", value);

export const checkAndRefreshToken = async (param?: {
  onError?: () => void;
  onSuccess?: () => void;
}) => {
  const access_token = getAccessTokenFromLocalStorage();
  const refresh_token = getRefreshTokenFromLocalStorage();
  //Chưa đăng nhập thì không cho chạy
  if (!access_token || !refresh_token) return;
  const decodedAccessToken = jwt.decode(access_token) as {
    exp: number;
    iat: number;
  };
  const decodedRefreshToken = jwt.decode(refresh_token) as {
    exp: number;
    iat: number;
  };

  //Thời điểm hết hạn của token tính theo s
  const now = Math.round(new Date().getTime() / 1000);
  //Trường hợp fresh token hết hạn thì không sử lý
  if (decodedRefreshToken.exp <= now) return;

  if (
    decodedAccessToken.exp - now <
    (decodedAccessToken.exp - decodedAccessToken.iat) / 3
  ) {
    //Goi api refresh token
    try {
      const res = await authRequest.refreshToken();
      setAccessTokenToLocalStorage(res.payload.data.access_token);
      setRefreshTokenToLocalStorage(res.payload.data.refresh_token);
      param?.onSuccess && param?.onSuccess();
    } catch (error) {
      param?.onError && param?.onError();
    }
  }
};
