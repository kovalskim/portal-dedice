import { z } from 'zod';

export type AssetsIdentificationFormFields = z.infer<
  typeof assetsIdentificationFormSchema
>;

export type AssetFields = z.infer<typeof asset>;

export const asset = z.object({
  type: z.string().min(1, { message: 'Povinné pole' }),
  name: z.string().optional(),
  value: z.preprocess(
    (value) => (typeof value === 'string' ? Number(value) : value),
    z
      .number({ required_error: 'Povinné pole' })
      .min(1, { message: 'Celková hodnota musí být minimálně 1 Kč' })
      .refine((value) => !isNaN(value), {
        message: 'Hodnota musí být číslo',
      }),
  ),
  SJM: z.preprocess(
    (value) => (typeof value === 'string' ? value === 'true' : value),
    z.boolean({ required_error: 'Povinné pole' }),
  ),
});

export const assetsIdentificationFormSchema = z.object({
  assets: z.array(asset),
});
