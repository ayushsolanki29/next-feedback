import { z } from "zod";

export const messageSchema = z.object({
  content: z
    .string()
    .min(10, { message: "content must be least 10 characters long" })
    .max(300, { message: "content must be greater than 300 characters long" }),
  username: z.string(),
});
