import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Form } from '@frontend/components/forms/Form.tsx';
import { NewParticipants } from '@frontend/pages/proceeding/participants/components/addParticipants/NewParticipants.tsx';
import { participantSchema } from '@shared/schemas/participantSchema.ts';

export type ParticipantFormFields = z.infer<typeof participantSchema>;

type AddParticipantsFormFields = {
  id: string;
  onSubmit: (data: { participants: ParticipantFormFields[] }) => Promise<void>;
};

export const AddParticipantsForm = ({
  id,
  onSubmit,
}: AddParticipantsFormFields) => {
  const schema = z.object({
    participants: z
      .array(participantSchema)
      .min(1, 'Je potřeba zadat údaje alespoň jednoho účastníka řízení.'),
  });

  return (
    <Form
      id={id}
      onSubmit={onSubmit}
      resolver={zodResolver(schema)}
      defaultValues={{
        participants: [{ firstname: '', lastname: '', email: '' }],
      }}
    >
      <NewParticipants />
    </Form>
  );
};
