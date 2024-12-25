import { Role } from "@/constants/type";
import { z } from "zod";

export const AccountSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  address: z.string(),
  phoneNumber: z.string(),
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
    address: z.string(),
    phoneNumber: z.string(),
    role: z.string(),
    avatar: z.string().nullable(),
  }),
});

export type AccountResType = z.TypeOf<typeof AccountRes>;

export const AccountListRes = z.object({
  data: z.array(AccountSchema),
});

export type AccountListResType = z.TypeOf<typeof AccountListRes>;

export const CreateEmployeeAccountBody = z
  .object({
    name: z.string().trim().min(2, "Tên phải có ít nhất 2 ký tự").max(256),
    email: z.string().email("Email không hợp lệ"),
    avatar: z.string().optional(),
    address: z.string().min(1, "Địa chỉ không được để trống"),
    phoneNumber: z
      .string()
      .min(1, "Số điện thoại không được để trống")
      .regex(
        /(((\+|)84)|0)(3|5|7|8|9)+([0-9]{8})\b/,
        "Số điện thoại không hợp lệ"
      ),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự").max(100),
    confirmPassword: z
      .string()
      .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
      .max(100),
  })
  .strict()
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "Mật khẩu không khớp",
        path: ["confirmPassword"],
      });
    }
  });

export type CreateEmployeeAccountBodyType = z.TypeOf<
  typeof CreateEmployeeAccountBody
>;

export const UpdateEmployeeAccountBody = z
  .object({
    name: z.string().trim().min(2, "Tên phải có ít nhất 2 ký tự").max(256),
    email: z.string().email("Email không hợp lệ"),
    avatar: z.string().optional(),
    address: z.string().optional(),
    phoneNumber: z.string().optional(),
    changePassword: z.boolean().optional(),
    password: z.string().min(6).max(100).optional(),
    confirmPassword: z.string().min(6).max(100).optional(),
    role: z.enum([Role.Owner, Role.Employee]).optional().default(Role.Employee),
  })
  .strict()
  .superRefine(({ confirmPassword, password, changePassword }, ctx) => {
    if (changePassword) {
      if (!password || !confirmPassword) {
        ctx.addIssue({
          code: "custom",
          message: "Please enter a new password and confirm the new password",
          path: ["changePassword"],
        });
      } else if (confirmPassword !== password) {
        ctx.addIssue({
          code: "custom",
          message: "Passwords do not match",
          path: ["confirmPassword"],
        });
      }
    }
  });

export type UpdateEmployeeAccountBodyType = z.TypeOf<
  typeof UpdateEmployeeAccountBody
>;

export const GetListGuestsRes = z.object({
  data: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      tableNumber: z.number().nullable(),
      createdAt: z.date(),
      updatedAt: z.date(),
    })
  ),
  message: z.string(),
  statusCode: z.number(),
});

export type GetListGuestsResType = z.TypeOf<typeof GetListGuestsRes>;

export const GetGuestListQueryParams = z.object({
  fromDate: z.coerce.date().optional(),
  toDate: z.coerce.date().optional(),
});

export type GetGuestListQueryParamsType = z.TypeOf<
  typeof GetGuestListQueryParams
>;

export const CreateGuestBody = z
  .object({
    name: z.string().trim().min(2).max(256),
    tableNumber: z.number(),
  })
  .strict();

export type CreateGuestBodyType = z.TypeOf<typeof CreateGuestBody>;

export const CreateGuestRes = z.object({
  message: z.string(),
  data: z.object({
    id: z.number(),
    name: z.string(),
    role: z.enum([Role.Guest]),
    tableNumber: z.number().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
  }),
});

export type CreateGuestResType = z.TypeOf<typeof CreateGuestRes>;
