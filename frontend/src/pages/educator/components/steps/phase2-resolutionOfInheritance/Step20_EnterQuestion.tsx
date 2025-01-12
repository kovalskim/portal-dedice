import { Stack } from '@chakra-ui/react';

import { PrimaryButton, SecondaryButton } from '@frontend/components/buttons';
import { useEducatorState } from '@frontend/pages/educator/hooks/useEducatorState.ts';

import { StepperWrapper } from '../common/StepperWrapper.tsx';

export const Step20_EnterQuestion = () => {
  const { setState, incrementState, setPrevState } = useEducatorState();

  return (
    <StepperWrapper
      title={
        'Chcete vědět, jak funguje rozdělení pozůstalosti v rámci pozůstalostního řízení?'
      }
      prevBtnProps={{ onClick: setPrevState }}
      showStep={2}
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
            setState(30);
          }}
        >
          Ne
        </SecondaryButton>
      </Stack>
    </StepperWrapper>
  );
};
