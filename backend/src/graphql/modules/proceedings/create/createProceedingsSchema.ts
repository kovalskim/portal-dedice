import { z } from 'zod';

// Validation schema for the sign-up process
export const createProceedingsSchema = z.object({
  proceedingsNumber: z.string().min(1, { message: 'Povinné pole' }),
  firstname: z.string().min(1, { message: 'Povinné pole' }),
  lastname: z.string().min(1, { message: 'Povinné pole' }),
  deathdate: z.string().min(1, { message: 'Povinné pole' }),
});
