import { Stack } from '@chakra-ui/react';

import { PrimaryButton, SecondaryButton } from '@frontend/components/buttons';
import { useEducatorState } from '@frontend/hooks/useEducatorState.ts';

import { StepperWrapper } from '../common/StepperWrapper.tsx';

export const Step10 = () => {
  const { setState, incrementState, setPrevState } = useEducatorState();

  return (
    <StepperWrapper
      title={'Chcete se dozvědět více o průběhu dědického řízení?'}
      showStep={1}
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
            setState(20);
          }}
        >
          Ne
        </SecondaryButton>
      </Stack>
    </StepperWrapper>
  );
};
