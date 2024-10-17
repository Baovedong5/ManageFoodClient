import { Role } from "@/constants/type";
import { z } from "zod";

export const AccountSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  role: z.enum([Role.Owner, Role.Employee]),
  avater: z.string().nullable(),
});

export type AccountType = z.TypeOf<typeof AccountSchema>;

export const AccountRes = z.object({
  message: z.string(),
  statusCode: z.number(),
  data: z.object({
    id: z.number(),
    name: z.string(),
    email: z.string(),
    role: z.string(),
    avatar: z.string().nullable(),
  }),
});

export type AccountResType = z.TypeOf<typeof AccountRes>;

export const AccountListRes = z.array(AccountSchema);

export type AccountListResType = z.TypeOf<typeof AccountListRes>;
