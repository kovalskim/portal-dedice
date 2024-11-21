import { DeceasedPersonFormFields } from '@frontend/components/forms/deceasedPersonForm/DeceasedPersonForm.tsx';
import { useEducatorState } from '@frontend/hooks/useEducatorState.ts';
import { useEducatorStorage } from '@frontend/hooks/useEducatorStorage.ts';
import { NotaryIdentificationInput } from '@frontend/pages/educator/components/notary-identification/NotaryIdentificationInput.tsx';

import { StepperWrapper } from '../common/StepperWrapper.tsx';

export const Step01 = () => {
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
        label: 'Přeskočit idetifikaci',
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
