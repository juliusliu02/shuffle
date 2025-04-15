import { z } from "zod";

export const signupSchema = z.object({
  username: z
    .string()
    .min(2, "Username must be at least 2 characters.")
    .max(30, "Username must not be longer than 30 characters."),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters.")
    .max(30, "Password must not be longer than 30 characters."),
  fullName: z.string().nonempty("Name must not be empty."),
});

export const loginSchema = signupSchema.pick({
  username: true,
  password: true,
});
