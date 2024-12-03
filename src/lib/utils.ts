import { clsx, type ClassValue } from "clsx";
import { UseFormSetError } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { EntityError } from "@/lib/http";
import { toast } from "@/hooks/use-toast";
import jwt from "jsonwebtoken";
import authRequest from "@/app/apiRequests/auth";
import {
  DishStatus,
  OrderStatus,
  Role,
  RoleType,
  TableStatus,
} from "@/constants/type";
import envConfig from "@/config";
import guestApi from "@/app/apiRequests/guest";
import { format } from "date-fns";
import { BookX, CookingPot, HandCoins, Loader, Truck } from "lucide-react";
import { io } from "socket.io-client";

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

export const removeTokenFromLocalStorage = () => {
  isBrowser && localStorage.removeItem("access_token");
  isBrowser && localStorage.removeItem("refresh_token");
};

export const checkAndRefreshToken = async (param?: {
  onError?: () => void;
  onSuccess?: () => void;
  force?: boolean;
}) => {
  const access_token = getAccessTokenFromLocalStorage();
  const refresh_token = getRefreshTokenFromLocalStorage();
  //Chưa đăng nhập thì không cho chạy
  if (!access_token || !refresh_token) return;
  const decodedAccessToken = jwt.decode(access_token) as {
    exp: number;
    iat: number;
    role: RoleType;
  };
  const decodedRefreshToken = jwt.decode(refresh_token) as {
    exp: number;
    iat: number;
    role: RoleType;
  };

  //Thời điểm hết hạn của token tính theo s
  const now = Math.round(new Date().getTime() / 1000);

  //Trường hợp fresh token hết hạn thì không sử lý
  if (decodedRefreshToken.exp <= now) {
    removeTokenFromLocalStorage();
    return param?.onError && param?.onError();
  }

  if (
    param?.force ||
    decodedAccessToken.exp - now <
      (decodedAccessToken.exp - decodedAccessToken.iat) / 3
  ) {
    //Goi api refresh token
    try {
      const role = decodedRefreshToken.role;
      const res =
        role === Role.Guest
          ? await guestApi.refreshToken()
          : await authRequest.refreshToken();
      setAccessTokenToLocalStorage(res.payload.data.access_token);
      setRefreshTokenToLocalStorage(res.payload.data.refresh_token);
      param?.onSuccess && param?.onSuccess();
    } catch (error) {
      param?.onError && param?.onError();
    }
  }
};

export const getVietnameseDishStatus = (
  status: (typeof DishStatus)[keyof typeof DishStatus]
) => {
  switch (status) {
    case DishStatus.Available:
      return "Có sẵn";
    case DishStatus.Unavailable:
      return "Không có sẵn";
    default:
      return "Ẩn";
  }
};

export const getVietnameseTableStatus = (
  status: (typeof TableStatus)[keyof typeof TableStatus]
) => {
  switch (status) {
    case TableStatus.Available:
      return "Có sẵn";
    case TableStatus.Reserved:
      return "Đã đặt";
    default:
      return "Ẩn";
  }
};

export const getVietnameseOrderStatus = (
  status: (typeof OrderStatus)[keyof typeof OrderStatus]
) => {
  switch (status) {
    case OrderStatus.Delivered:
      return "Đã giao";
    case OrderStatus.Paid:
      return "Đã thanh toán";
    case OrderStatus.Pending:
      return "Chờ xác nhận";
    case OrderStatus.Processing:
      return "Đang xử lý";
    default:
      return "Từ chối";
  }
};

export const formatCurrency = (number: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(number);
};

export const getTableLink = ({
  token,
  tableNumber,
}: {
  token: string;
  tableNumber: number;
}) => {
  return (
    envConfig.NEXT_PUBLIC_URL + "/tables/" + tableNumber + "?token=" + token
  );
};

export const decodeToken = (token: string) => {
  return jwt.decode(token) as {
    role: RoleType;
  };
};

export function removeAccents(str: string) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}

export const simpleMatchText = (fullText: string, matchText: string) => {
  return removeAccents(fullText.toLowerCase()).includes(
    removeAccents(matchText.trim().toLowerCase())
  );
};

export const formatDateTimeToLocaleString = (date: string | Date) => {
  return format(
    date instanceof Date ? date : new Date(date),
    "HH:mm:ss dd/MM/yyyy"
  );
};

export const formatDateTimeToTimeString = (date: string | Date) => {
  return format(date instanceof Date ? date : new Date(date), "HH:mm:ss");
};

export const OrderStatusIcon = {
  [OrderStatus.Pending]: Loader,
  [OrderStatus.Processing]: CookingPot,
  [OrderStatus.Rejected]: BookX,
  [OrderStatus.Delivered]: Truck,
  [OrderStatus.Paid]: HandCoins,
};

export const generateSocketInstance = (access_token: string) => {
  return io(envConfig.NEXT_PUBLIC_URL_IMAGE, {
    auth: {
      Authorization: `Bearer ${access_token}`,
    },
  });
};

export const wrapServerApi = async <T>(fn: () => Promise<T>) => {
  let result = null;
  try {
    result = await fn();
  } catch (error: any) {
    if (error.digest?.includes("NEXT_REDIRECT")) {
      throw error;
    }
  }
  return result;
};
