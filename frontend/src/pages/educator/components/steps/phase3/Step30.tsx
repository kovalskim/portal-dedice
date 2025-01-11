import { Stack } from '@chakra-ui/react';

import { PrimaryButton, SecondaryButton } from '@frontend/components/buttons';
import { useEducatorState } from '@frontend/hooks/useEducatorState.ts';
import { StepperWrapper } from '@frontend/pages/educator/components/steps/common/StepperWrapper.tsx';

export const Step30 = () => {
  const { setState, incrementState, setPrevState } = useEducatorState();

  return (
    <StepperWrapper
      title={'Chcete si vyzkoušet, jak funguje rozdělení pozůstalosti v praxi?'}
      showStep={3}
      prevBtnProps={{ onClick: setPrevState }}
    >
      <Stack textAlign="center" spacing={6} width={200}>
        <PrimaryButton
          onClick={() => {
            incrementState();
          }}
        >
          Ano
        </PrimaryButton>
        <SecondaryButton
          onClick={() => {
            setState(40);
          }}
        >
          Ne
        </SecondaryButton>
      </Stack>
    </StepperWrapper>
  );
};
