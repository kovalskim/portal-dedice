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
  hideLabels?: boolean;
};

export const NumberedStepper = ({
  steps,
  activeStep,
  hideLabels,
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

          {!hideLabels && (
            <Box flexShrink="0">
              <StepTitle>{step.title}</StepTitle>
            </Box>
          )}

          <StepSeparator />
        </ChakraStep>
      ))}
    </Stepper>
  );
};
