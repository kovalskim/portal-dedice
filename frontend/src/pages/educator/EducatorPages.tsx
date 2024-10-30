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

type Step = {
  index: number;
  stepEl: () => JSX.Element;
};

// step naming convention: StepXY where X = index of phase, Y = index of step in phase
const steps: Step[] = [
  { index: 0, stepEl: Step00 },
  { index: 1, stepEl: Step01 },
  { index: 2, stepEl: Step02 },
  { index: 3, stepEl: Step03 },
  { index: 10, stepEl: Step10 },
  { index: 11, stepEl: Step11 },
  { index: 12, stepEl: Step12 },
  { index: 13, stepEl: Step13 },
];

const findStepEl = (stepIndex: number) => {
  return steps.find((val) => val.index === stepIndex)?.stepEl;
};

export const EducatorPage = () => {
  const { state } = useEducatorState();

  const CurrentStep = findStepEl(state.currentStep) || StepNotFound;

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
