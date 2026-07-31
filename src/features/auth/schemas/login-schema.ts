import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email ya username likhna zaroori hai" }),
  password: z
    .string()
    .min(4, { message: "Password kam se kam 4 characters ka hona chahiye" }),
  rememberMe: z.boolean(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
