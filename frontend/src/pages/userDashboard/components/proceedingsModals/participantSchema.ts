import { zod } from '@frontend/components';

export const participantSchema = zod.object({
  firstname: zod.string().min(1, { message: 'Povinné pole' }),
  lastname: zod.string().min(1, { message: 'Povinné pole' }),
  email: zod.string().email('Zadejte platnou emailovou adresu'),
});
