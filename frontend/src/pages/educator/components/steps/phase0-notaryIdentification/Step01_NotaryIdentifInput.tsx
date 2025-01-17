import { DeceasedPersonFormFields } from '@frontend/components/forms/deceasedPersonForm/DeceasedPersonForm.tsx';
import { NotaryIdentificationInput } from '@frontend/pages/educator/components/notary-identification/NotaryIdentificationInput.tsx';
import { useEducatorState } from '@frontend/pages/educator/hooks/useEducatorState.ts';
import { useEducatorStorage } from '@frontend/pages/educator/hooks/useEducatorStorage.ts';

import { StepperWrapper } from '../common/StepperWrapper.tsx';

export const Step01_NotaryIdentifInput = () => {
  const { incrementState, setPrevState, setState } = useEducatorState();
  const { updateStorage } = useEducatorStorage();

  const handleSubmitNext = (formData: DeceasedPersonFormFields) => {
    updateStorage({
      deceasedPersonFormData: formData,
    });
    incrementState();
  };

  const skipIdentification = () => {
    setState(10);
  };

  return (
    <StepperWrapper
      title={'Který notář bude pověřen vedením dědického řízení?'}
      showStep={0}
      midBtnProps={{
        label: 'Přeskočit identifikaci',
        onClick: skipIdentification,
      }}
      nextBtnProps={{
        label: 'Jaký notář bude pověřen?',
        idFormSubmit: 'deceasedPersonForm',
        type: 'submit',
      }}
      prevBtnProps={{ onClick: setPrevState }}
    >
      <NotaryIdentificationInput onSubmit={handleSubmitNext} />
    </StepperWrapper>
  );
};
