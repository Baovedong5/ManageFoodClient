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
