import { z } from 'zod';

import { Role } from '../../../frontend/src/context/auth/auth-core';

export const inviteUserFormSchema = z
  .object({
    firstname: z.string().min(1, { message: 'Jméno nesmí být prázdné' }),
    lastname: z.string().min(1, { message: 'Příjmení nesmí být prázdné.' }),
    email: z.string().email({ message: 'Zadejte platnou emailovou adresu.' }),
    role: z.string().min(1, { message: 'Vyberte roli.' }),
    court: z.object({ label: z.string(), value: z.string() }).optional(),
    lastnameLetters: z
      .array(z.object({ label: z.string(), value: z.string() }))
      .optional(),
    birthDaysMonths: z
      .array(
        z.object({
          days: z.array(z.object({ label: z.number(), value: z.number() })),
          months: z.array(z.object({ label: z.number(), value: z.number() })),
        }),
      )
      .optional(),
    deathDaysMonths: z
      .array(
        z.object({
          days: z.array(z.object({ label: z.number(), value: z.number() })),
          months: z.array(z.object({ label: z.number(), value: z.number() })),
        }),
      )
      .optional(),
    rules: z.object({
      lastnameLetters: z.boolean(),
      birthDaysMonths: z.boolean(),
      deathDaysMonths: z.boolean(),
    }),
  })
  .refine((data) => data.role !== Role.NOTARY || data.court, {
    message: 'Vyberte příslušný soud.',
    path: ['court'],
  })
  .refine(
    (data) =>
      data.role !== Role.NOTARY ||
      !data.rules.lastnameLetters || // Check if rules.lastname is false, bypass this validation
      (data.lastnameLetters && data.lastnameLetters.length > 0), // Only require lastnameLetters if rules.lastname is true
    {
      message: 'Vyberte alespoň jedno počáteční písmeno příjmení.',
      path: ['lastnameLetters'],
    },
  )
  .refine(
    (data) =>
      data.role !== Role.NOTARY ||
      !data.rules.birthDaysMonths ||
      (data.birthDaysMonths &&
        data.birthDaysMonths.every(
          (entry) => entry.days.length > 0 || entry.months.length > 0,
        )),
    {
      message: 'Každé omezení musí mít alespoň jeden den nebo měsíc.',
      path: ['birthDaysMonths'],
    },
  )
  .refine(
    (data) =>
      data.role !== Role.NOTARY ||
      !data.rules.deathDaysMonths ||
      (data.deathDaysMonths &&
        data.deathDaysMonths.every(
          (entry) => entry.days.length > 0 || entry.months.length > 0,
        )),
    {
      message: 'Každé omezení musí mít alespoň jeden den nebo měsíc.',
      path: ['deathDaysMonths'],
    },
  )
  .refine(
    (data) =>
      data.role !== Role.NOTARY ||
      Object.values(data.rules).some((rule) => rule),
    {
      message: 'Musíte aktivovat alespoň jedno pravidlo.',
      path: ['rules'],
    },
  );
