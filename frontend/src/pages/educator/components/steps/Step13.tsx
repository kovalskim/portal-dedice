import { Stack } from '@chakra-ui/react';

import { PrimaryButton, SecondaryButton } from '@frontend/components';
import { useEducatorState } from '@frontend/hooks/useEducatorState';

import { StepperWrapper } from './common/StepperWrapper';

export const Step13 = () => {
  const { resetState, incrementState } = useEducatorState();

  return (
    <StepperWrapper
      title={
        'Chcete vědět jak funguje rozdělení pozůstalosti v rámci pozůstalostního řízení?'
      }
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
        <SecondaryButton onClick={resetState}>Ne</SecondaryButton>
      </Stack>
    </StepperWrapper>
  );
};
