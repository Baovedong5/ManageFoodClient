import guestApi from "@/app/apiRequests/guest";
import { useMutation } from "@tanstack/react-query";

export const useGuestLoginMutation = () => {
  return useMutation({
    mutationFn: guestApi.login,
  });
};

export const useGuestLogoutMutation = () => {
  return useMutation({
    mutationFn: guestApi.logout,
  });
};
