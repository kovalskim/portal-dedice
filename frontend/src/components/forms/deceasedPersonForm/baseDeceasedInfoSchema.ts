import { zod } from '@frontend/components';

const postalCodeRegex = new RegExp('^\\d{3}\\s\\d{2}$');

export const baseDeceasedInfoSchema = zod.object({
  sex: zod.string().min(1, { message: 'Povinné pole' }),
  firstname: zod.string().min(1, { message: 'Povinné pole' }),
  lastname: zod.string().min(1, { message: 'Povinné pole' }),
  birthdate: zod.string().min(1, { message: 'Povinné pole' }),
  deathdate: zod.string().min(1, { message: 'Povinné pole' }),
  streetWithNumber: zod.string().min(1, { message: 'Povinné pole' }),
  city: zod
    .string()
    .min(1, { message: 'Povinné pole' })
    .refine((val) => val === 'Praha' || '', {
      message: 'V současné době je podporována pouze obec Praha',
    }),
  district: zod.string().min(1, { message: 'Povinné pole' }),
  postalCode: zod
    .string()
    .min(1, { message: 'Povinné pole' })
    .regex(postalCodeRegex, { message: 'Neplatné PSČ' }),
});
