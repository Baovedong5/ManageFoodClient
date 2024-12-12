import paymentApi from "@/app/apiRequests/payment";
import { useMutation } from "@tanstack/react-query";

export const useCreateUrlPaymentMutation = () => {
  return useMutation({
    mutationFn: paymentApi.createUrlPayment,
  });
};
