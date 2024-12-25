"use client";

import { useAppContext } from "@/components/app-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import envConfig from "@/config";
import { OrderStatus } from "@/constants/type";
import { toast } from "@/hooks/use-toast";
import { formatCurrency, getVietnameseOrderStatus } from "@/lib/utils";
import {
  useGuestGetOrderListQuery,
  useGuestPaymentVnpayMutation,
} from "@/queries/useGuest";
import { useCreateUrlPaymentMutation } from "@/queries/usePayment";
import {
  PayGuestOrdersResType,
  UpdateOrderResType,
} from "@/schemaValidations/order.schema";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const OrderCart = () => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const { data, refetch } = useGuestGetOrderListQuery();
  const orders = useMemo(() => data?.payload.data ?? [], [data]);

  const guestPaymentVnPay = useGuestPaymentVnpayMutation();

  const createUrlPayment = useCreateUrlPaymentMutation();

  const { socket } = useAppContext();

  const { waitingForPaying, paid } = useMemo(() => {
    return orders.reduce(
      (result, order) => {
        if (
          order.status === OrderStatus.Delivered
          // order.status === OrderStatus.Processing ||
          // order.status === OrderStatus.Pending
        ) {
          return {
            ...result,
            waitingForPaying: {
              price:
                result.waitingForPaying.price +
                order.dishSnapshot.price * order.quantity,
              quantity: result.waitingForPaying.quantity + order.quantity,
            },
          };
        }
        if (order.status === OrderStatus.Paid) {
          return {
            ...result,
            paid: {
              price:
                result.paid.price + order.dishSnapshot.price * order.quantity,
              quantity: result.paid.quantity + order.quantity,
            },
          };
        }

        return result;
      },
      {
        waitingForPaying: {
          price: 0,
          quantity: 0,
        },
        paid: {
          price: 0,
          quantity: 0,
        },
      }
    );
  }, [orders]);

  useEffect(() => {
    if (socket?.connected) {
      onConnect();
    }

    function onConnect() {
      console.log(socket?.id);
    }

    function onDisconnect() {
      console.log("disconnect");
    }

    function onUpdateOrder(data: UpdateOrderResType["data"]) {
      const {
        dishSnapshot: { name },
        quantity,
      } = data;
      toast({
        description: `Món ${name} (SL: ${quantity}) vừa được cập nhật sang trạng thái ${getVietnameseOrderStatus(
          data.status
        )}`,
      });
      refetch();
    }

    function onPayment(data: PayGuestOrdersResType["data"]) {
      console.log(">>> datat payment", data);

      const { guest } = data[0];

      toast({
        description: `Bạn đã thanh toán thành công ${data.length} đơn`,
      });

      refetch();
    }

    socket?.on("update-order", onUpdateOrder);
    socket?.on("connect", onConnect);
    socket?.on("disconnect", onDisconnect);
    socket?.on("payment", onPayment);

    return () => {
      socket?.off("connect", onConnect);
      socket?.off("disconnect", onDisconnect);
      socket?.off("update-order", onUpdateOrder);
      socket?.off("payment", onPayment);
    };
  }, [refetch, socket]);

  const handlePayment = async (method: string) => {
    const paymentRef = uuidv4();
    if (method === "Direct") {
    } else {
      const res = await guestPaymentVnPay.mutateAsync({
        guestId: orders[0].guestId as number,
        paymentRef,
      });

      if (res.payload.data) {
        const r = await createUrlPayment.mutateAsync({
          amount: waitingForPaying.price,
          locale: "vn",
          paymentRef,
        });

        if (r.payload.data) {
          router.push(r.payload.data.url);
        }
      }
    }
  };

  const hasDeliveredOrders = orders.some(
    (order) => order.status === OrderStatus.Delivered
  );

  return (
    <>
      {orders.map((order, index) => (
        <div key={order.id} className="flex gap-4">
          <div className="text-sm font-semibold">{index + 1}</div>
          <div className="flex-shrink-0">
            <Image
              src={`${envConfig.NEXT_PUBLIC_URL_IMAGE}/images/dish/${order.dishSnapshot.image}`}
              alt={order.dishSnapshot.name}
              height={100}
              width={100}
              quality={100}
              className="object-cover w-[80px] h-[80px] rounded-md"
            />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm">{order.dishSnapshot.name}</h3>
            <div className="text-xs font-semibold">
              {formatCurrency(order.dishSnapshot.price)} x {""}
              <Badge className="px-1">{order.quantity}</Badge>
            </div>
          </div>
          <div className="flex-shrink-0 ml-auto flex justify-center items-center">
            <Badge variant={"outline"}>
              {getVietnameseOrderStatus(order.status)}
            </Badge>
          </div>
        </div>
      ))}
      <Button
        className="w-full mt-4"
        onClick={() => setOpen(true)}
        disabled={!hasDeliveredOrders}
      >
        Thanh toán
      </Button>

      <Drawer open={open} onOpenChange={setOpen} disablePreventScroll={true}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Chọn phương thức thanh toán</DrawerTitle>
            <DrawerDescription>
              Vui lòng chọn phương thức thanh toán bạn muốn sử dụng.
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4">
            <p className="text-sm text-gray-600">
              <strong>Thanh toán sau tại quầy:</strong> Quý khách vui lòng dùng
              bữa xong và thanh toán tại quầy. Nhân viên sẽ hỗ trợ bạn thực hiện
              thanh toán.
            </p>
          </div>
          <DrawerFooter>
            <Button onClick={() => handlePayment("Direct")}>
              Thanh toán sau tại quầy
            </Button>
            <Button onClick={() => handlePayment("Online")}>
              Thanh toán online
            </Button>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Hủy
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default OrderCart;
