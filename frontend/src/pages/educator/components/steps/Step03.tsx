import { Stack } from '@chakra-ui/react';

import { PrimaryButton, SecondaryButton } from '@frontend/components';
import { useEducatorState } from '@frontend/hooks/useEducatorState';

import { StepperWrapper } from './common/StepperWrapper';

export const Step03 = () => {
  const { resetState, incrementState } = useEducatorState();

  return (
    <StepperWrapper
      title={'Chcete se dozvědět více o průběhu dědického řízení?'}
      showStep={1}
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
