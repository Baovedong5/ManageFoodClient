"use client";

import { useAppContext } from "@/components/app-provider";
import {
  getAccessTokenFromLocalStorage,
  getRefreshTokenFromLocalStorage,
} from "@/lib/utils";
import { useLogoutMutation } from "@/queries/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";

function Logout() {
  const { mutateAsync } = useLogoutMutation();
  const searchParams = useSearchParams();
  const refreshTokenFromUrl = searchParams.get("refresh_token");
  const accessTokenFromUrl = searchParams.get("access_token");
  const { setRole } = useAppContext();
  const router = useRouter();

  const ref = useRef<any>(null);

  useEffect(() => {
    if (
      ref.current ||
      !refreshTokenFromUrl ||
      !accessTokenFromUrl ||
      (refreshTokenFromUrl &&
        refreshTokenFromUrl !== getRefreshTokenFromLocalStorage()) ||
      (accessTokenFromUrl &&
        accessTokenFromUrl !== getAccessTokenFromLocalStorage())
    ) {
      return;
    }

    ref.current = mutateAsync;

    mutateAsync().then((res) => {
      setTimeout(() => {
        ref.current = null;
      }, 1000);
      setRole();
      router.push("/login");
    });
  }, [router, mutateAsync, refreshTokenFromUrl, accessTokenFromUrl, setRole]);

  return <div>Logout page</div>;
}

const LogoutPage = () => {
  return (
    <Suspense>
      <Logout />
    </Suspense>
  );
};

export default LogoutPage;
