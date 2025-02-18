import { z } from 'zod';

export const authSchema = z.object({
  username: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  password: z.string().min(6).nullable(),
});
