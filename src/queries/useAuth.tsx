import authRequest from "@/app/apiRequests/auth";
import { useMutation } from "@tanstack/react-query";

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: authRequest.login,
  });
};

export const useLogoutMutation = () => {
  return useMutation({
    mutationFn: authRequest.logout,
  });
};
