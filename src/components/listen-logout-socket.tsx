import { useLogoutMutation } from "@/queries/useAuth";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAppContext } from "./app-provider";
import { handleErrorApi } from "@/lib/utils";

const UNAUTHENTICATED_PATH = ["/login", "/logout", "/refresh-token"];

export default function ListenLogoutSocket() {
  const pathName = usePathname();
  const router = useRouter();
  const { setRole, disconnectSocket, socket } = useAppContext();
  const { isPending, mutateAsync } = useLogoutMutation();

  useEffect(() => {
    if (UNAUTHENTICATED_PATH.includes(pathName)) return;
    async function onLogout() {
      if (isPending) return;
      try {
        await mutateAsync();
        setRole();
        disconnectSocket();
        router.push("/");
      } catch (error: any) {
        handleErrorApi({
          error,
        });
      }
    }
    socket?.on("logout", onLogout);

    return () => {
      socket?.off("logout", onLogout);
    };
  }, [
    socket,
    pathName,
    isPending,
    disconnectSocket,
    mutateAsync,
    setRole,
    router,
  ]);
  return null;
}
