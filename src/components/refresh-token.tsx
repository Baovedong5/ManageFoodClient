"use client";

import { checkAndRefreshToken } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

//Không check refresh token
const UNAUTHENTICATED_PATH = ["/login", "/refresh-token"];

const RefreshToken = () => {
  const pathName = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (UNAUTHENTICATED_PATH.includes(pathName)) return;

    let interval: any = null;

    //Phải gọi lần đầu tiên, vì interval sẽ chạy sau thời gian timeout
    checkAndRefreshToken({
      onError: () => {
        clearInterval(interval);
        router.push("/login");
      },
    });
    //time out interval phải bé hơn thời gian hết hạn của access token
    //VD thời gian hết hạn của access token là 10s thì 1s sẽ cho check 1 lần

    const TIMEOUT = 1000;
    interval = setInterval(
      () =>
        checkAndRefreshToken({
          onError: () => {
            clearInterval(interval);
            router.push("/login");
          },
        }),
      TIMEOUT
    );
    return () => {
      clearInterval(interval);
    };
  }, [pathName, router]);
  return null;
};

export default RefreshToken;
