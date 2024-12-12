import http from "@/lib/http";
import {
  CreateUrlPaymentBodyType,
  CreateUrlPaymentResType,
} from "@/schemaValidations/payment.schema";

const paymentApi = {
  createUrlPayment: (body: CreateUrlPaymentBodyType) =>
    http.post<CreateUrlPaymentResType>("/vnpay/payment-url", body),
};

export default paymentApi;
