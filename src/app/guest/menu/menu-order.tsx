"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useDishListQuery } from "@/queries/useDish";
import envConfig from "@/config";
import {
  cn,
  formatCurrency,
  getVietnameseDishCategory,
  handleErrorApi,
} from "@/lib/utils";
import Quantity from "@/app/guest/menu/quantity";
import { useMemo, useState } from "react";
import { GuestCreateOrdersBodyType } from "@/schemaValidations/guest.schema";
import { useGuestOrderMutation } from "@/queries/useGuest";
import { useRouter } from "next/navigation";
import { DishCategory, DishCategoryValues, DishStatus } from "@/constants/type";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const MenuOrder = () => {
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const { data } = useDishListQuery();
  const dishes = data?.payload.data ?? [];

  const [orders, setOrders] = useState<GuestCreateOrdersBodyType>([]);

  const { mutateAsync } = useGuestOrderMutation();
  const router = useRouter();

  const totalPrice = useMemo(() => {
    return dishes.reduce((result, dish) => {
      const order = orders.find((order) => order.dishId === dish.id);
      if (!order) {
        return result;
      }
      return result + dish.price * order.quantity;
    }, 0);
  }, [dishes, orders]);

  const handleQuantityChange = (dishId: number, quantity: number) => {
    setOrders((prevOrders) => {
      if (quantity === 0) {
        return prevOrders.filter((order) => order.dishId !== dishId);
      }
      const index = prevOrders.findIndex((order) => order.dishId === dishId);
      if (index === -1) {
        return [...prevOrders, { dishId, quantity }];
      }
      const newOrders = [...prevOrders];
      newOrders[index] = { ...newOrders[index], quantity };
      return newOrders;
    });
  };

  const handleOrder = async () => {
    try {
      await mutateAsync(orders);
      router.push("/guest/orders");
    } catch (error) {
      handleErrorApi({
        error,
      });
    }
  };

  const handleConfirmOrder = () => {
    handleOrder();
    setOpen(false);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const filteredDishes = useMemo(() => {
    if (selectedCategory === "All") {
      return dishes;
    }

    return dishes.filter((dish) => dish.category === selectedCategory);
  }, [dishes, selectedCategory]);

  return (
    <div>
      <Tabs value={selectedCategory} onValueChange={handleCategoryChange}>
        <TabsList className="flex gap-4 py-4 ">
          <TabsTrigger value="All">Tất cả</TabsTrigger>
          {DishCategoryValues.map((category) => (
            <TabsTrigger value={category} key={category}>
              {getVietnameseDishCategory(category)}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="All">
          <div className="grid gap-4 py-4 h-[500px] overflow-y-auto">
            {filteredDishes.map((dish) => (
              <div
                key={dish.id}
                className={cn("flex gap-4", {
                  "pointer-events-none": dish.status === DishStatus.Unavailable,
                })}
              >
                <div className="flex-shrink-0 relative">
                  {dish.status === DishStatus.Unavailable && (
                    <span className="absolute inset-0 flex items-center justify-center text-sm">
                      Hết hàng
                    </span>
                  )}
                  <Image
                    src={`${envConfig.NEXT_PUBLIC_URL_IMAGE}/images/dish/${dish.image}`}
                    alt={dish.name}
                    height={100}
                    width={100}
                    quality={100}
                    className="object-cover w-[80px] h-[80px] rounded-md"
                  />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold">{dish.name}</h3>
                  <p className="text-xs">{dish.description}</p>
                  <p className="text-xs font-semibold">
                    {formatCurrency(dish.price)}
                  </p>
                </div>
                <div className="flex-shrink-0 ml-auto flex justify-center items-center">
                  <Quantity
                    onChange={(value) => handleQuantityChange(dish.id, value)}
                    value={
                      orders.find((order) => order.dishId === dish.id)
                        ?.quantity || 0
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {DishCategoryValues.map((category) => (
          <TabsContent key={category} value={category}>
            <div className="grid gap-4 py-4 h-[500px] overflow-y-auto">
              {filteredDishes.map((dish) => (
                <div
                  key={dish.id}
                  className={cn("flex gap-4", {
                    "pointer-events-none":
                      dish.status === DishStatus.Unavailable,
                  })}
                >
                  <div className="flex-shrink-0 relative">
                    {dish.status === DishStatus.Unavailable && (
                      <span className="absolute inset-0 flex items-center justify-center text-sm">
                        Hết hàng
                      </span>
                    )}
                    <Image
                      src={`${envConfig.NEXT_PUBLIC_URL_IMAGE}/images/dish/${dish.image}`}
                      alt={dish.name}
                      height={100}
                      width={100}
                      quality={100}
                      className="object-cover w-[80px] h-[80px] rounded-md"
                    />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold">{dish.name}</h3>
                    <p className="text-xs">{dish.description}</p>
                    <p className="text-xs font-semibold">
                      {formatCurrency(dish.price)}
                    </p>
                  </div>
                  <div className="flex-shrink-0 ml-auto flex justify-center items-center">
                    <Quantity
                      onChange={(value) => handleQuantityChange(dish.id, value)}
                      value={
                        orders.find((order) => order.dishId === dish.id)
                          ?.quantity || 0
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <div className="sticky bottom-0">
        <Button
          className="w-full justify-between"
          onClick={() => setOpen(true)}
          disabled={orders.length === 0}
        >
          <span>Đặt hàng · {orders.length} món</span>
          <span>{formatCurrency(totalPrice)}</span>
        </Button>
      </div>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận đặt hàng</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn đặt {orders.length} món với tổng giá{" "}
              {formatCurrency(totalPrice)}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpen(false)}>
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmOrder}>
              Xác nhận
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MenuOrder;
