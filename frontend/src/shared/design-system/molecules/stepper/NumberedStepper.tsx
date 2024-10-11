import {
  Box,
  Step as ChakraStep,
  StepIcon,
  StepIndicator,
  StepNumber,
  Stepper,
  StepSeparator,
  StepStatus,
  StepTitle,
} from '@chakra-ui/react';

export type Step = {
  title: string;
};

export type NumberedStepperProps = {
  steps: Step[];
  activeStep: number;
};

export const NumberedStepper = ({
  steps,
  activeStep,
}: NumberedStepperProps) => {
  return (
    <Stepper size="lg" index={activeStep} colorScheme="goldenYellow">
      {steps.map((step, index) => (
        <ChakraStep key={index}>
          <StepIndicator>
            <StepStatus
              complete={<StepIcon />}
              incomplete={<StepNumber />}
              active={<StepNumber />}
            />
          </StepIndicator>

          <Box flexShrink="0">
            <StepTitle>{step.title}</StepTitle>
          </Box>

          <StepSeparator />
        </ChakraStep>
      ))}
    </Stepper>
  );
};
