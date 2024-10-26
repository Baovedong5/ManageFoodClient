import guestApi from "@/app/apiRequests/guest";
import { useMutation, useQuery } from "@tanstack/react-query";

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

export const useGuestOrderMutation = () => {
  return useMutation({
    mutationFn: guestApi.order,
  });
};

export const useGuestGetOrderListQuery = () => {
  return useQuery({
    queryKey: ["guest-orders"],
    queryFn: guestApi.getOrderList,
  });
};
