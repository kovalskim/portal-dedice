import { z } from 'zod';

const postalCodeRegex = new RegExp('^\\d{3}\\s\\d{2}$');

export const baseDeceasedInfoSchema = z.object({
  sex: z.string().min(1, { message: 'Povinné pole' }),
  firstname: z.string().min(1, { message: 'Povinné pole' }),
  lastname: z.string().min(1, { message: 'Povinné pole' }),
  birthdate: z.string().min(1, { message: 'Povinné pole' }),
  deathdate: z.string().min(1, { message: 'Povinné pole' }),
  streetWithNumber: z.string().min(1, { message: 'Povinné pole' }),
  city: z
    .string()
    .min(1, { message: 'Povinné pole' })
    .refine((val) => val === 'Praha' || '', {
      message: 'V současné době je podporována pouze obec Praha',
    }),
  district: z.string().min(1, { message: 'Povinné pole' }),
  postalCode: z
    .string()
    .min(1, { message: 'Povinné pole' })
    .regex(postalCodeRegex, { message: 'Neplatné PSČ' }),
});

export const narratorSchema = z.object({
  firstname: z.string().min(1, { message: 'Povinné pole' }),
  lastname: z.string().min(1, { message: 'Povinné pole' }),
  email: z.string().email('Zadejte platnou emailovou adresu'),
});

export const newProceedingInputSchema = z.object({
  deceasedPersonInfo: baseDeceasedInfoSchema,
  narratorContactInfo: narratorSchema,
});
