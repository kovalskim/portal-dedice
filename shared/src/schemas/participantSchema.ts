import { z } from 'zod';

export const participantSchema = z.object({
  firstname: z.string().min(1, { message: 'Povinné pole' }),
  lastname: z.string().min(1, { message: 'Povinné pole' }),
  email: z.string().email('Zadejte platnou emailovou adresu'),
});
