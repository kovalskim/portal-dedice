import { Heading } from '@chakra-ui/react';

import { zod } from '@frontend/components';
import {
  DeceasedPersonForm,
  DeceasedPersonFormFields,
} from '@frontend/components/forms/deceasedPersonForm/DeceasedPersonForm.tsx';
import {
  AddParticipantForm,
  ParticipantFormFields,
} from '@frontend/pages/userDashboard/components/proceedingsModals/AddParticipantForm.tsx';
import { useNewProceedingFormStore } from '@frontend/pages/userDashboard/hooks/useNewProceedingFormStore.ts';
import { newProceedingInputSchema } from '@shared/schemas/newProceedingInputSchema';

export type NewProceedingFormFields = zod.infer<
  typeof newProceedingInputSchema
>;

type NewProceedingFormProps = {
  onSubmitStep1: (data: DeceasedPersonFormFields) => void;
  onSubmitStep2: (data: ParticipantFormFields) => Promise<void>;
  onClose: () => void;
};

export const NewProceedingForm = ({
  onSubmitStep1,
  onSubmitStep2,
}: NewProceedingFormProps) => {
  const { step, formData } = useNewProceedingFormStore();

  return (
    <>
      {step === 1 && (
        <>
          <Heading size="sm" mb={4} textAlign="center">
            Krok 1: Informace o zůstaviteli
          </Heading>
          <DeceasedPersonForm
            loadDefaultFrom={formData.deceasedPersonInfo}
            onSubmit={onSubmitStep1}
            id="deceasedPersonInfo"
          />
        </>
      )}
      {step === 2 && (
        <>
          <Heading size="sm" mb={6} textAlign="center">
            Krok2: Přidání účastníka (vypravitele)
          </Heading>
          <AddParticipantForm id="narratorInfo" onSubmit={onSubmitStep2} />
        </>
      )}
    </>
  );
};
