import orderApi from "@/app/apiRequests/order";
import {
  GetOrdersQueryParamsType,
  PayGuestOrdersBodyType,
  UpdateOrderBodyType,
} from "@/schemaValidations/order.schema";
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

export const useGetOrderListQuery = (queryParams: GetOrdersQueryParamsType) => {
  return useQuery({
    queryFn: () => orderApi.getOrderList(queryParams),
    queryKey: ["orders", queryParams],
  });
};

export const useGetOrderDetailQuery = ({
  id,
  enabled,
}: {
  id: number;
  enabled: boolean;
}) => {
  return useQuery({
    queryKey: ["orders", id],
    queryFn: () => orderApi.getOrderDetail(id),
    enabled,
  });
};

export const usePayForGuestMutation = () => {
  return useMutation({
    mutationFn: (body: PayGuestOrdersBodyType) => orderApi.pay(body),
  });
};

export const useCreateOrderMutation = () => {
  return useMutation({
    mutationFn: orderApi.createOrders,
  });
};

export const useUpdateStatusVnpayMutation = () => {
  return useMutation({
    mutationFn: orderApi.updateStatusVnpay,
  });
};
