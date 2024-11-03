import { Stack } from '@chakra-ui/react';

import { PrimaryButton, SecondaryButton } from '@frontend/components';
import { useEducatorState } from '@frontend/hooks/useEducatorState.ts';

import { StepperWrapper } from '../common/StepperWrapper.tsx';

export const Step10 = () => {
  const { setState, incrementState } = useEducatorState();

  return (
    <StepperWrapper
      title={'Chcete se dozvědět více o průběhu dědického řízení?'}
      showStep={1}
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
            setState(20);
          }}
        >
          Ne
        </SecondaryButton>
      </Stack>
    </StepperWrapper>
  );
};
