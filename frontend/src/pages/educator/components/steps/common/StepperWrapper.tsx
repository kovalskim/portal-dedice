import { FC, PropsWithChildren } from 'react';
import { Box, Card, Heading, Stack } from '@chakra-ui/react';

import { PrimaryButton, SecondaryButton } from '@frontend/components';
import { SummaryStepper } from '@frontend/components/stepper/SummaryStepper';
import { stepsCountShowenInEducation } from '@frontend/constants';
import { useEducatorState } from '@frontend/hooks/useEducatorState';

type StepperWrapperProps = {
  title: string;
  showStep: number;
  onNext?: () => void;
  onPrev?: () => void;
  hideNext?: boolean;
  hidePrev?: boolean;
  disableNext?: boolean;
  disablePrev?: boolean;
  submitFormNext?: boolean;
  idFormSubmit?: string;
  nextLabel?: string;
  prevLabel?: string;
};

export const StepperWrapper: FC<PropsWithChildren<StepperWrapperProps>> = ({
  title,
  children,
  showStep,
  onNext,
  onPrev,
  hideNext,
  hidePrev,
  disableNext,
  disablePrev,
  submitFormNext,
  idFormSubmit,
  nextLabel = 'Další',
  prevLabel = 'Zpět',
}) => {
  const { state } = useEducatorState();

  return (
    <Card
      width="100%"
      minHeight="500px"
      maxW={{
        base: '90%',
        md: '80%',
        lg: '70%',
      }}
      p="8"
    >
      <Stack alignItems="center" display="flex" flex={1}>
        <Box width={{ sm: '100%', md: '600px' }} pb={6}>
          <SummaryStepper
            stepsCount={stepsCountShowenInEducation}
            activeStep={showStep}
          />
        </Box>
        <Heading as="h1" size="md" textAlign="center">
          {title}
        </Heading>
        <Box display="flex" flex="1" alignItems="center" py={8}>
          <Box
            width="100%"
            height="100%"
            px={{
              sm: 6,
              md: 8,
              lg: 12,
            }}
          >
            {children}
          </Box>
        </Box>
        <Box
          width="100%"
          display="flex"
          flexDirection={{ base: 'column-reverse', md: 'row' }}
          justifyContent="space-between"
          gap={4}
        >
          {!hidePrev && (
            <SecondaryButton
              isDisabled={disablePrev || state.prevSteps.length < 1}
              // TODO: better prev -> when setPrevState is passed here error occurs
              onClick={onPrev}
            >
              {prevLabel}
            </SecondaryButton>
          )}
          {!hideNext && (
            <PrimaryButton
              type={submitFormNext ? 'submit' : 'button'}
              form={idFormSubmit ? idFormSubmit : undefined}
              isDisabled={disableNext}
              onClick={onNext}
            >
              {nextLabel}
            </PrimaryButton>
          )}
        </Box>
      </Stack>
    </Card>
  );
};
