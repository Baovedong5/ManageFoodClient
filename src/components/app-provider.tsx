"use client";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import RefreshToken from "@/components/refresh-token";
import { useEffect, useRef } from "react";
import {
  decodeToken,
  generateSocketInstance,
  getAccessTokenFromLocalStorage,
  removeTokenFromLocalStorage,
} from "@/lib/utils";
import { RoleType } from "@/constants/type";
import type { Socket } from "socket.io-client";
import ListenLogoutSocket from "./listen-logout-socket";
import { create } from "zustand";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

type AppStoreType = {
  isAuth: boolean;
  role: RoleType | undefined;
  setRole: (role?: RoleType | undefined) => void;
  socket: Socket | undefined;
  setSocket: (socket?: Socket | undefined) => void;
  disconnectSocket: () => void;
};

export const useAppStore = create<AppStoreType>((set) => ({
  isAuth: false,
  role: undefined as RoleType | undefined,
  setRole: (role?: RoleType | undefined) => {
    set({ role, isAuth: Boolean(role) });
    if (!role) {
      removeTokenFromLocalStorage();
    }
  },
  socket: undefined as Socket | undefined,
  setSocket: (socket?: Socket | undefined) => set({ socket }),
  disconnectSocket: () =>
    set((state) => {
      state.socket?.disconnect();
      return { socket: undefined };
    }),
}));

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const setRole = useAppStore((state) => state.setRole);
  const setSocket = useAppStore((state) => state.setSocket);

  const count = useRef(0);

  useEffect(() => {
    if (count.current === 0) {
      const accessToken = getAccessTokenFromLocalStorage();
      if (accessToken) {
        const role = decodeToken(accessToken).role;
        setRole(role);
        setSocket(generateSocketInstance(accessToken));
      }
      count.current++;
    }
  }, [setRole, setSocket]);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <RefreshToken />
      <ListenLogoutSocket />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default AppProvider;
