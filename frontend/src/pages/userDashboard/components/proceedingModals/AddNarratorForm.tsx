import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler } from 'react-hook-form';

import { NewParticipantInput } from '@frontend/components/forms/addParticipants/NewParticipantInput.tsx';
import { Form } from '@frontend/components/forms/Form.tsx';
import { ParticipantFormFields } from '@frontend/pages/proceeding/participants/components/addParticipants/AddParticipantsForm.tsx';
import { participantSchema } from '@shared/schemas/participantSchema.ts';

type AddNarratorFormProps = {
  id: string;
  onSubmit: SubmitHandler<ParticipantFormFields>;
};

export const AddNarratorForm = ({ id, onSubmit }: AddNarratorFormProps) => {
  return (
    <Form
      id={id}
      onSubmit={onSubmit}
      resolver={zodResolver(participantSchema)}
      defaultValues={{ firstname: '', lastname: '', email: '' }}
    >
      <NewParticipantInput />
    </Form>
  );
};
