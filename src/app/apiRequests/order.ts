import http from "@/lib/http";
import {
  GetOrdersResType,
  UpdateOrderBodyType,
  UpdateOrderResType,
} from "@/schemaValidations/order.schema";

const orderApi = {
  getOrderList: () => http.get<GetOrdersResType>("/orders"),
  updateOrder: (orderId: number, body: UpdateOrderBodyType) =>
    http.patch<UpdateOrderResType>(`/orders/${orderId}`, body),
};

export default orderApi;
