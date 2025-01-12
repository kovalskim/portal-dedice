import { z } from 'zod';

import { getImageDimensions } from '@frontend/utils/fileUtil';

export const getSchema = (isEditMode: boolean) =>
  z.object({
    title: z.string().min(1, 'Název článku je povinný'),
    date: z.string().optional(),
    coverImage: isEditMode
      ? z
          .instanceof(File)
          .optional()
          .refine(
            async (file) => {
              if (!file) return true;
              if (file.size >= 5 * 1024 * 1024) return false;
              const image = await getImageDimensions(file);
              return (
                image.width >= 600 &&
                image.width <= 900 &&
                image.height >= 400 &&
                image.height <= 700
              );
            },
            {
              message:
                'Obrázek musí mít šířku mezi 700-900px, výšku mezi 400-600px a maximální velikost 5MB',
            },
          )
      : z
          .instanceof(File, { message: 'Obrázek je povinný' })
          .refine((file) => file.size < 5 * 1024 * 1024, {
            message: 'Maximální velikost obrázku je 5MB',
          })
          .refine(
            async (file) => {
              const image = await getImageDimensions(file);
              return (
                image.width >= 600 &&
                image.width <= 900 &&
                image.height >= 400 &&
                image.height <= 700
              );
            },
            {
              message:
                'Obrázek musí mít šířku mezi 700-900px a výšku mezi 400-600px',
            },
          ),
    content: z.string().min(1, 'Obsah článku je povinný'),
  });
