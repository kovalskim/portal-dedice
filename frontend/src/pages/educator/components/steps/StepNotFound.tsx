import { Box, Text } from '@chakra-ui/react';

import { PrimaryButton } from '@frontend/components/buttons';
import { useEducatorState } from '@frontend/hooks/useEducatorState';

import { StepperWrapper } from './common/StepperWrapper';

export const StepNotFound = () => {
  const { resetState } = useEducatorState();

  return (
    <StepperWrapper title={'Krok nenalezen !'} showStep={5}>
      <Box textAlign="center">
        <Text>A jeje tohle se nám nepovedlo. Zkuste to prosím od začátku.</Text>
        <Box pt={10}>
          <PrimaryButton onClick={resetState}>Začít od začátku</PrimaryButton>
        </Box>
      </Box>
    </StepperWrapper>
  );
};
