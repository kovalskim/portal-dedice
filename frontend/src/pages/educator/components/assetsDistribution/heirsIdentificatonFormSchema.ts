import { z } from 'zod';

export type HeirsIdentificationFormFields = z.infer<
  typeof heirsIdentificationFormSchema
>;

export const heirsIdentificationFormSchema = z
  .object({
    hasChildren: z.string({ required_error: 'Povinné pole' }),
    childrenCount: z.preprocess(
      (value) => (typeof value === 'string' ? Number(value) : value),
      z
        .number()
        .refine((value) => !isNaN(value), {
          message: 'Hodnota musí být číslo',
        })
        .optional(),
    ),
    hasHusbandOrWife: z.string({ required_error: 'Povinné pole' }),
    hasLivingParents: z.string().optional(),
    hasLivingFather: z.preprocess(
      (value) => (typeof value === 'string' ? value === 'true' : value),
      z.boolean().optional(),
    ),
    hasLivingMother: z.preprocess(
      (value) => (typeof value === 'string' ? value === 'true' : value),
      z.boolean().optional(),
    ),
    hasHousemate: z.string().optional(),
    hasSiblings: z.string().optional(),
    siblingsCount: z.preprocess(
      (value) => (typeof value === 'string' ? Number(value) : value),
      z
        .number()
        .refine((value) => !isNaN(value), {
          message: 'Hodnota musí být číslo',
        })
        .optional(),
    ),
  })
  .refine(
    (data) =>
      !(data.hasChildren === 'true') ||
      (data.childrenCount && data.childrenCount >= 1),
    {
      message: 'Počet potomků musí být minimálně 1',
      path: ['childrenCount'],
    },
  )
  .refine(
    (data) => {
      if (data.hasChildren !== 'true') {
        return data.hasLivingParents !== undefined;
      }
      return true;
    },
    {
      message: 'Povinné pole.',
      path: ['hasLivingParents'],
    },
  )
  .refine(
    (data) => {
      return !(
        data.hasLivingParents === 'true' &&
        !data.hasLivingFather &&
        !data.hasLivingMother
      );
    },
    {
      message: 'Povinné pole',
      path: ['hasLivingFather'],
    },
  )
  .refine(
    (data) => {
      return !(
        data.hasLivingParents === 'true' &&
        !data.hasLivingFather &&
        !data.hasLivingMother
      );
    },
    {
      message: 'Povinné pole',
      path: ['hasLivingMother'],
    },
  )
  .refine(
    (data) => {
      if (data.hasChildren !== 'true') {
        return data.hasHousemate !== undefined;
      }
      return true;
    },
    {
      message: 'Povinné pole.',
      path: ['hasHousemate'],
    },
  )
  .refine(
    (data) => {
      if (
        data.hasHusbandOrWife !== 'true' &&
        data.hasLivingParents !== 'true' &&
        data.hasLivingParents !== undefined
      ) {
        return data.hasSiblings !== undefined;
      }
      return true;
    },
    {
      message: 'Povinné pole.',
      path: ['hasSiblings'],
    },
  )
  .refine(
    (data) =>
      data.hasSiblings !== 'true' ||
      (data.siblingsCount && data.siblingsCount >= 1),
    {
      message: 'Počet sourozenců musí být minimálně 1',
      path: ['siblingsCount'],
    },
  );
