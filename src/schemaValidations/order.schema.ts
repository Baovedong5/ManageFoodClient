import { DishStatusValues, OrderStatusValues } from "@/constants/type";
import z from "zod";
import { AccountSchema } from "@/schemaValidations/account.schema";
import { TableSchema } from "./table.schema";

const DishSnapshotSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.number(),
  image: z.string(),
  description: z.string(),
  status: z.enum(DishStatusValues),
  dishId: z.number().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const OrderSchema = z.object({
  id: z.number(),
  guestId: z.number().nullable(),
  guest: z
    .object({
      id: z.number(),
      name: z.string(),
      tableNumber: z.number().nullable(),
      createdAt: z.date(),
      updatedAt: z.date(),
    })
    .nullable(),
  tableNumber: z.number().nullable(),
  dishSnapshotId: z.number(),
  dishSnapshot: DishSnapshotSchema,
  quantity: z.number(),
  orderHandlerId: z.number().nullable(),
  orderHandler: AccountSchema.nullable(),
  status: z.enum(OrderStatusValues),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const UpdateOrderBody = z.object({
  status: z.enum(OrderStatusValues),
  dishId: z.number(),
  quantity: z.number(),
});

export type UpdateOrderBodyType = z.TypeOf<typeof UpdateOrderBody>;

export const UpdateOrderRes = z.object({
  message: z.string(),
  data: OrderSchema,
  statusCode: z.number(),
});

export type UpdateOrderResType = z.TypeOf<typeof UpdateOrderRes>;

export const GetOrdersQueryParams = z.object({
  fromDate: z.coerce.date().optional(),
  toDate: z.coerce.date().optional(),
});

export type GetOrdersQueryParamsType = z.TypeOf<typeof GetOrdersQueryParams>;

export const GetOrdersRes = z.object({
  message: z.string(),
  data: z.array(OrderSchema),
  statusCode: z.number(),
});

export type GetOrdersResType = z.TypeOf<typeof GetOrdersRes>;

export const GetOrdersDetailRes = z.object({
  message: z.string(),
  data: OrderSchema,
  statusCode: z.number(),
});

export type GetOrdersDetailResType = z.TypeOf<typeof GetOrdersDetailRes>;

export const GetOrderDetailRes = z.object({
  message: z.string(),
  data: OrderSchema.extend({
    table: TableSchema,
  }),
  statusCode: z.number(),
});

export type GetOrderDetailResType = z.TypeOf<typeof GetOrderDetailRes>;

export const CreateOrdersBody = z
  .object({
    guestId: z.number(),
    orders: z.array(
      z.object({
        dishId: z.number(),
        quantity: z.number(),
      })
    ),
  })
  .strict();

export type CreateOrdersBodyType = z.TypeOf<typeof CreateOrdersBody>;

export const CreateOrdersRes = z.object({
  message: z.string(),
  data: z.array(OrderSchema),
  statusCode: z.number(),
});

export type CreateOrdersResType = z.TypeOf<typeof CreateOrdersRes>;

export const PayGuestOrdersBody = z.object({
  guestId: z.number(),
});

export const PaymentGuestVnPayBody = z.object({
  guestId: z.number(),
  paymentRef: z.string(),
});

export type PaymentGuestVnPayBodyType = z.TypeOf<typeof PaymentGuestVnPayBody>;

export const PaymentGuestVnPayRes = z.object({
  message: z.string(),
  data: z.object({
    orders: z.array(OrderSchema),
    paymentRef: z.string(),
  }),
  statusCode: z.number(),
});

export const UpdateStatusVnPayBopdy = z.object({
  paymentRef: z.string(),
  status: z.string(),
});

export type UpdateStatusVnPayBopdyType = z.TypeOf<
  typeof UpdateStatusVnPayBopdy
>;

export const UpdateStatusVnPayRes = z.object({
  message: z.string(),
  data: z.array(OrderSchema),
  statusCode: z.number(),
});

export type UpdateStatusVnPayResType = z.TypeOf<typeof UpdateStatusVnPayRes>;

export type PaymentGuestVnPayResType = z.TypeOf<typeof PaymentGuestVnPayRes>;

export type PayGuestOrdersBodyType = z.TypeOf<typeof PayGuestOrdersBody>;

export const PayGuestOrdersRes = GetOrdersRes;

export type PayGuestOrdersResType = z.TypeOf<typeof PayGuestOrdersRes>;
