import http from "@/lib/http";
import {
  CreateOrdersBodyType,
  CreateOrdersResType,
  GetOrdersDetailResType,
  GetOrdersQueryParamsType,
  GetOrdersResType,
  PayGuestOrdersBodyType,
  PayGuestOrdersResType,
  UpdateOrderBodyType,
  UpdateOrderResType,
  UpdateStatusVnPayBopdyType,
  UpdateStatusVnPayResType,
} from "@/schemaValidations/order.schema";
import queryString from "query-string";

const orderApi = {
  createOrders: (body: CreateOrdersBodyType) =>
    http.post<CreateOrdersResType>("/orders", body),
  getOrderList: (queryParams: GetOrdersQueryParamsType) =>
    http.get<GetOrdersResType>(
      "/orders?" +
        queryString.stringify({
          fromDate: queryParams.fromDate?.toISOString(),
          toDate: queryParams.toDate?.toISOString(),
        })
    ),
  updateOrder: (orderId: number, body: UpdateOrderBodyType) =>
    http.patch<UpdateOrderResType>(`/orders/${orderId}`, body),

  getOrderDetail: (orderId: number) =>
    http.get<GetOrdersDetailResType>(`/orders/${orderId}`),

  pay: (body: PayGuestOrdersBodyType) =>
    http.post<PayGuestOrdersResType>(`/orders/pay`, body),
  updateStatusVnpay: (body: UpdateStatusVnPayBopdyType) =>
    http.post<UpdateStatusVnPayResType>(`/orders/update-payment-status`, body),
};

export default orderApi;
