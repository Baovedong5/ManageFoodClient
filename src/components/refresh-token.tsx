"use client";

import { checkAndRefreshToken } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAppContext } from "@/components/app-provider";

//Không check refresh token
const UNAUTHENTICATED_PATH = ["/login", "/logout", "/refresh-token"];

const RefreshToken = () => {
  const pathName = usePathname();
  const router = useRouter();
  const { disconnectSocket, socket } = useAppContext();

  useEffect(() => {
    if (UNAUTHENTICATED_PATH.includes(pathName)) return;

    let interval: any = null;

    //Phải gọi lần đầu tiên, vì interval sẽ chạy sau thời gian timeout
    const onRefreshToken = (force?: boolean) =>
      checkAndRefreshToken({
        onError: () => {
          clearInterval(interval);
          disconnectSocket();
          router.push("/login");
        },
        force,
      });
    onRefreshToken();
    //time out interval phải bé hơn thời gian hết hạn của access token
    //VD thời gian hết hạn của access token là 10s thì 1s sẽ cho check 1 lần

    const TIMEOUT = 1000;
    interval = setInterval(onRefreshToken, TIMEOUT);

    if (socket?.connected) {
      onConnect();
    }

    function onConnect() {
      console.log(socket?.id);
    }

    function onDisconnect() {
      console.log("disconnect");
    }

    function onRefreshTokenSocket() {
      onRefreshToken(true);
    }

    socket?.on("connect", onConnect);
    socket?.on("disconnect", onDisconnect);
    socket?.on("refresh-token", onRefreshTokenSocket);

    return () => {
      clearInterval(interval);
      socket?.off("connect", onConnect);
      socket?.off("disconnect", onDisconnect);
      socket?.off("refresh-token", onRefreshTokenSocket);
    };
  }, [pathName, router, socket]);

  return null;
};

export default RefreshToken;
