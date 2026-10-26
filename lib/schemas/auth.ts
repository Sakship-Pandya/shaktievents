import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email().trim().toLowerCase(),
  password: z.string().min(1, 'Enter your password'),
});

export type LoginInput = z.infer<typeof loginSchema>;

/** Used by the admin "change password" form and the seed. */
export const passwordSchema = z
  .string()
  .min(10, 'Use at least 10 characters')
  .max(200)
  .refine((v) => /[a-z]/i.test(v) && /\d/.test(v), 'Include at least one letter and one number');
