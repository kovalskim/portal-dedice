import { z } from 'zod';

import { deceasedInfoSchema } from './deceasedInfoSchema';
import { narratorSchema } from './narratorSchema';

export const newProceedingInputSchema = z.object({
  deceasedPersonInfo: deceasedInfoSchema,
  narratorContactInfo: narratorSchema,
});
