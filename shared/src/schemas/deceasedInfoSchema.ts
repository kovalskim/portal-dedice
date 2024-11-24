import { z } from 'zod';

const postalCodeRegex = new RegExp('^\\d{3}\\s\\d{2}$');

export const deceasedInfoSchema = z
  .object({
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
  })
  .refine(
    (data) => {
      const birthdate = new Date(data.birthdate);
      const deathdate = new Date(data.deathdate);
      return deathdate > birthdate;
    },
    {
      message: 'Datum úmrtí musí být větší než datum narození',
      path: ['deathdate'],
    },
  );
