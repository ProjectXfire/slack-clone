import { z } from "zod";

const PASSWORD_VALIDATIONS = z
  .string()
  .min(8, "Password must have at least 8 characters")
  .regex(/[A-Z]/, "Password must have at least one capital letter")
  .regex(/[0-9]/, "Password must have at least one number")
  .regex(/[^a-zA-Z0-9]/, "Password must have at least one special character");

export const signUpSchema = z
  .object({
    email: z.string().email(),
    password: PASSWORD_VALIDATIONS,
    confirmPassword: z.string(),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
