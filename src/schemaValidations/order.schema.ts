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

export const GetOrderDetailRes = z.object({
  message: z.string(),
  data: OrderSchema.extend({
    table: TableSchema,
  }),
  statusCode: z.number(),
});

export type GetOrderDetailResType = z.TypeOf<typeof GetOrderDetailRes>;
