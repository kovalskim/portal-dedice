import { z } from 'zod';

import { deceasedInfoSchema } from './deceasedInfoSchema';
import { participantSchema } from './participantSchema';

export const newProceedingInputSchema = z.object({
  deceasedPersonInfo: deceasedInfoSchema,
  narratorContactInfo: participantSchema,
});
