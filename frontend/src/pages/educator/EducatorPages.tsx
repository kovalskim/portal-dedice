import { Box } from '@chakra-ui/react';

import { useEducatorState } from '@frontend/hooks/useEducatorState';
import {
  Step00,
  Step01,
  Step02,
  Step03,
  Step10,
  Step11,
  Step12,
  Step13,
  StepNotFound,
} from '@frontend/pages/educator/components/steps';

const steps = [Step00, Step01, Step02, Step03, Step10, Step11, Step12, Step13];

export const EducatorPage = () => {
  const { state } = useEducatorState();

  const CurrentStep = steps[state.currentStep] || StepNotFound;

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100%"
    >
      <CurrentStep />
    </Box>
  );
};
