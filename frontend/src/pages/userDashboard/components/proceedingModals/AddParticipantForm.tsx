import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';

import { Form } from '@frontend/components/forms/Form';
import { NewParticipantInput } from '@frontend/pages/userDashboard/components/proceedingModals/NewParticipantInput';
import { participantSchema } from '@frontend/pages/userDashboard/components/proceedingModals/participantSchema';

export type ParticipantFormFields = zod.infer<typeof participantSchema>;

type AddParticipantFormFields = {
  id: string;
  onSubmit: (data: ParticipantFormFields) => Promise<void>;
};

export const AddParticipantForm = ({
  id,
  onSubmit,
}: AddParticipantFormFields) => {
  return (
    <Form
      id={id}
      onSubmit={onSubmit}
      resolver={zodResolver(participantSchema)}
      defaultValues={{
        firstname: '',
        lastname: '',
        email: '',
      }}
    >
      <NewParticipantInput />
    </Form>
  );
};
