import { z } from "zod";

export const uploadMediaRes = z.object({
  statusCode: z.number(),
  message: z.string(),
  data: z.object({
    fileName: z.string(),
  }),
});

export type uploadMediaResType = z.TypeOf<typeof uploadMediaRes>;
