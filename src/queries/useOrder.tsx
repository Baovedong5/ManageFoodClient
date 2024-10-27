import orderApi from "@/app/apiRequests/order";
import { UpdateOrderBodyType } from "@/schemaValidations/order.schema";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useUpdateOrderMutation = () => {
  return useMutation({
    mutationFn: ({
      orderId,
      ...body
    }: UpdateOrderBodyType & { orderId: number }) =>
      orderApi.updateOrder(orderId, body),
  });
};

export const useGetOrderListQuery = () => {
  return useQuery({
    queryKey: ["orders"],
    queryFn: orderApi.getOrderList,
  });
};