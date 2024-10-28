import http from "@/lib/http";
import {
  GetOrdersDetailResType,
  GetOrdersQueryParamsType,
  GetOrdersResType,
  UpdateOrderBodyType,
  UpdateOrderResType,
} from "@/schemaValidations/order.schema";
import queryString from "query-string";

const orderApi = {
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
};

export default orderApi;
