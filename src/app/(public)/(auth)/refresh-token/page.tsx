"use client";

import {
  checkAndRefreshToken,
  getRefreshTokenFromLocalStorage,
} from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

function RefreshToken() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const refreshTokenFromUrl = searchParams.get("refresh_token");
  const redirectPathName = searchParams.get("redirect");

  useEffect(() => {
    if (
      refreshTokenFromUrl &&
      refreshTokenFromUrl === getRefreshTokenFromLocalStorage()
    ) {
      checkAndRefreshToken({
        onSuccess: () => {
          router.push(redirectPathName || "/");
        },
      });
    } else {
      router.push("/");
    }
  }, [router, refreshTokenFromUrl, redirectPathName]);

  return <div>Refresh token pag...</div>;
}

const RefreshTokenPage = () => {
  <Suspense fallback={<div>Loading...</div>}>
    <RefreshToken />
  </Suspense>;
};

export default RefreshTokenPage;
