"use client";

import {
  checkAndRefreshToken,
  getAccessTokenFromLocalStorage,
  getRefreshTokenFromLocalStorage,
  setAccessTokenToLocalStorage,
  setRefreshTokenToLocalStorage,
} from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import jwt from "jsonwebtoken";
import authRequest from "@/app/apiRequests/auth";

//Không check refresh token
const UNAUTHENTICATED_PATH = ["/login", "/refresh-token"];

const RefreshToken = async () => {
  const pathName = usePathname();
  useEffect(() => {
    if (UNAUTHENTICATED_PATH.includes(pathName)) return;

    let interval: any = null;

    //Phải gọi lần đầu tiên, vì interval sẽ chạy sau thời gian timeout
    checkAndRefreshToken({
      onError: () => {
        clearInterval(interval);
      },
    });
    //time out interval phải bé hơn thời gian hết hạn của access token
    //VD thời gian hết hạn của access token là 10s thì 1s sẽ cho check 1 lần

    const TIMEOUT = 1000;
    interval = setInterval(checkAndRefreshToken, TIMEOUT);
    return () => {
      clearInterval(interval);
    };
  }, [pathName]);
  return null;
};

export default RefreshToken;
