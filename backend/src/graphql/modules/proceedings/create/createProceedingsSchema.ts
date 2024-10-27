import { z } from 'zod';

// Validation schema for the sign-up process
export const createProceedingsSchema = z.object({
  proceedingsNumber: z.string().min(1, { message: 'Povinné pole' }),
  deceasedFirstName: z.string().min(1, { message: 'Povinné pole' }),
  deceasedLastName: z.string().min(1, { message: 'Povinné pole' }),
  deceasedDateOfDeath: z.string().min(1, { message: 'Povinné pole' }),
});
