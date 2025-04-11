import { z } from "zod";

export const signupSchema = z.object({
  username: z.string().min(2).max(30),
  password: z.string().min(6).max(30),
  fullName: z.string().nonempty(),
});

export const loginSchema = signupSchema.pick({
  username: true,
  password: true,
});
