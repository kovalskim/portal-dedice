import { Heading } from '@chakra-ui/react';

import { HeirsIdentificationForm } from '@frontend/pages/educator/components/assetsDistribution/HeirsIdentificationForm.tsx';
import { HeirsIdentificationFormFields } from '@frontend/pages/educator/components/assetsDistribution/heirsIdentificatonFormSchema.ts';
import { StepperWrapper } from '@frontend/pages/educator/components/steps/common/StepperWrapper.tsx';
import { useEducatorState } from '@frontend/pages/educator/hooks/useEducatorState.ts';
import { useEducatorStorage } from '@frontend/pages/educator/hooks/useEducatorStorage.ts';

export const Step31_HeirsIdentification = () => {
  const { incrementState, setPrevState } = useEducatorState();
  const { storage, updateStorage } = useEducatorStorage();

  const handleSubmit = (formData: HeirsIdentificationFormFields) => {
    updateStorage({
      assetsDistribution: {
        ...storage?.assetsDistribution,
        heirs: formData,
      },
    });
    incrementState();
  };

  return (
    <StepperWrapper
      title={'Chcete si vyzkoušet, jak funguje rozdělení pozůstalosti v praxi?'}
      showStep={3}
      prevBtnProps={{ onClick: setPrevState }}
      nextBtnProps={{
        idFormSubmit: 'heirsIdentificationForm',
        type: 'submit',
      }}
      maxWidth="container.xl"
    >
      <Heading as="h3" size="md" textAlign="center" my={8}>
        Krok 1: Určení dědiců
      </Heading>
      <HeirsIdentificationForm
        id="heirsIdentificationForm"
        onSubmit={handleSubmit}
        defaultValues={storage.assetsDistribution?.heirs}
      />
    </StepperWrapper>
  );
};
