import { useEducatorState } from '@frontend/hooks/useEducatorState';
import { useEducatorStorage } from '@frontend/hooks/useEducatorStorage.ts';
import { DeceasedPersonFormFields } from '@frontend/pages/educator/components/notary-identification/DeceasedPersonForm.tsx';
import { NotaryIdentificationInput } from '@frontend/pages/educator/components/notary-identification/NotaryIdentificationInput.tsx';

import { StepperWrapper } from './common/StepperWrapper';

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
        label: 'Odeslat formulář',
        idFormSubmit: 'deceasedPersonForm',
        type: 'submit',
      }}
      prevBtnProps={{ onClick: setPrevState }}
    >
      <NotaryIdentificationInput onSubmit={handleSubmitNext} />
    </StepperWrapper>
  );
};
