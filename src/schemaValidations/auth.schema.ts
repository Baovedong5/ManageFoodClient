import z from "zod";

export const LoginBody = z
  .object({
    username: z.string().email(),
    password: z.string().min(6).max(100),
  })
  .strict();

export type LoginBodyType = z.TypeOf<typeof LoginBody>;

export const LoginRes = z.object({
  statusCode: z.number(),
  message: z.string(),
  data: z.object({
    access_token: z.string(),
    refresh_token: z.string(),
    user: z.object({
      id: z.number(),
      name: z.string(),
      email: z.string(),
      role: z.string(),
    }),
  }),
});

export type LoginResType = z.TypeOf<typeof LoginRes>;

export const ChangePasswordBody = z
  .object({
    oldPassword: z.string().min(6).max(100),
    newPassword: z.string().min(6).max(100),
    confirmPassword: z.string().min(6).max(100),
  })
  .strict()
  .superRefine(({ confirmPassword, newPassword }, ctx) => {
    if (confirmPassword !== newPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Mật khẩu mới không khớp",
        path: ["confirmPassword"],
      });
    }
  });

export type ChangePasswordBodyType = z.TypeOf<typeof ChangePasswordBody>;

export const UpdateMeBody = z
  .object({
    name: z.string().min(2).max(100),
    avatar: z.string().optional(),
  })
  .strict();

export type UpdateMeBodyType = z.TypeOf<typeof UpdateMeBody>;
