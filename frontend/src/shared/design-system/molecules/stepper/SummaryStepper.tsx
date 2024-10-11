import {
  Box,
  Progress,
  Step,
  StepIndicator,
  Stepper,
  StepStatus,
} from '@chakra-ui/react';

export type SummaryStepperProps = {
  stepsCount: number;
  activeStep: number;
};

export const SummaryStepper = ({
  stepsCount,
  activeStep,
}: SummaryStepperProps) => {
  const progressPercent = (activeStep / (stepsCount - 1)) * 100;

  return (
    <Box position="relative">
      <Stepper size="sm" index={activeStep} gap="0" colorScheme="goldenYellow">
        {Array.from({ length: stepsCount }).map((_, index) => (
          <Step key={index}>
            <StepIndicator bg="white">
              <StepStatus />
            </StepIndicator>
          </Step>
        ))}
      </Stepper>
      <Progress
        value={progressPercent}
        position="absolute"
        height="3px"
        width="full"
        colorScheme="goldenYellow"
        top="10px"
        zIndex={-1}
      />
    </Box>
  );
};
