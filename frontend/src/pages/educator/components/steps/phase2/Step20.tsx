import { Stack } from '@chakra-ui/react';

import { PrimaryButton, SecondaryButton } from '@frontend/components';
import { useEducatorState } from '@frontend/hooks/useEducatorState.ts';

import { StepperWrapper } from '../common/StepperWrapper.tsx';

export const Step20 = () => {
  const { resetState, incrementState } = useEducatorState();

  return (
    <StepperWrapper
      title={
        'Chcete vědět, jak funguje rozdělení pozůstalosti v rámci pozůstalostního řízení?'
      }
      showStep={2}
      hideNext
      hidePrev
    >
      <Stack textAlign="center" spacing={6} width={200}>
        <PrimaryButton
          onClick={() => {
            incrementState();
          }}
        >
          Ano
        </PrimaryButton>
        <SecondaryButton onClick={resetState}>Ne</SecondaryButton>
      </Stack>
    </StepperWrapper>
  );
};
