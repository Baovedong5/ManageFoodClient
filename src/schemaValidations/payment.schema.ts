import z from "zod";

export const CreateUrlPaymentBody = z.object({
  amount: z.number(),
  locale: z.string(),
  paymentRef: z.string(),
});

export type CreateUrlPaymentBodyType = z.TypeOf<typeof CreateUrlPaymentBody>;

export const CreateUrlPaymentRes = z.object({
  statusCode: z.number(),
  message: z.string(),
  data: z.object({
    url: z.string(),
  }),
});

export type CreateUrlPaymentResType = z.TypeOf<typeof CreateUrlPaymentRes>;
