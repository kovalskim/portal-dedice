import { Box } from '@chakra-ui/react';

import { useEducatorState } from '@frontend/hooks/useEducatorState';
import { Step00 } from '@frontend/pages/educator/components/steps/phase0/Step00.tsx';
import { Step01 } from '@frontend/pages/educator/components/steps/phase0/Step01.tsx';
import { Step02 } from '@frontend/pages/educator/components/steps/phase0/Step02.tsx';
import { Step10 } from '@frontend/pages/educator/components/steps/phase1/Step10.tsx';
import { Step11 } from '@frontend/pages/educator/components/steps/phase1/Step11.tsx';
import { Step12 } from '@frontend/pages/educator/components/steps/phase1/Step12.tsx';
import { Step13 } from '@frontend/pages/educator/components/steps/phase1/Step13.tsx';
import { Step14 } from '@frontend/pages/educator/components/steps/phase1/Step14.tsx';
import { Step15 } from '@frontend/pages/educator/components/steps/phase1/Step15.tsx';
import { Step16 } from '@frontend/pages/educator/components/steps/phase1/Step16.tsx';
import { Step20 } from '@frontend/pages/educator/components/steps/phase2/Step20.tsx';
import { StepNotFound } from '@frontend/pages/educator/components/steps/StepNotFound.tsx';

type Step = {
  index: number;
  stepEl: () => JSX.Element;
};

// step naming convention: StepXY where X = index of phase, Y = index of step in phase
const steps: Step[] = [
  { index: 0, stepEl: Step00 },
  { index: 1, stepEl: Step01 },
  { index: 2, stepEl: Step02 },
  { index: 10, stepEl: Step10 },
  { index: 11, stepEl: Step11 },
  { index: 12, stepEl: Step12 },
  { index: 13, stepEl: Step13 },
  { index: 14, stepEl: Step14 },
  { index: 15, stepEl: Step15 },
  { index: 16, stepEl: Step16 },
  { index: 20, stepEl: Step20 },
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
