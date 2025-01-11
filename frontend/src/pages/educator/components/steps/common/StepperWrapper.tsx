import { FC, PropsWithChildren } from 'react';
import { Box, Card, Container, Flex, Heading } from '@chakra-ui/react';

import { PrimaryButton, SecondaryButton } from '@frontend/components/buttons';
import { SummaryStepper } from '@frontend/components/stepper/SummaryStepper';
import { stepsCountShowenInEducation } from '@frontend/constants';
import { useEducatorState } from '@frontend/hooks/useEducatorState.ts';

type NavigationButtonProps = {
  onClick?: () => void;
  disable?: boolean;
  idFormSubmit?: string;
  label?: string;
  type?: 'submit' | 'button';
};

type StepperWrapperProps = {
  title: string;
  showStep: number;
  nextBtnProps?: NavigationButtonProps;
  prevBtnProps?: NavigationButtonProps;
  midBtnProps?: NavigationButtonProps;
  maxWidth?: string;
};

export const StepperWrapper: FC<PropsWithChildren<StepperWrapperProps>> = ({
  title,
  children,
  showStep,
  midBtnProps,
  prevBtnProps,
  nextBtnProps,
  maxWidth = 'container.sm',
}) => {
  const { state } = useEducatorState();

  return (
    <Card
      width="100%"
      minHeight="500px"
      maxW={{
        base: '90%',
        lg: '80%',
      }}
      p="8"
    >
      <Flex alignItems="center" flexDirection="column" flex={1}>
        <Box width={{ base: '100%', md: '600px' }} pb={10}>
          <SummaryStepper
            stepsCount={stepsCountShowenInEducation}
            activeStep={showStep}
          />
        </Box>
        <Heading as="h1" size="md" textAlign="center">
          {title}
        </Heading>
        <Flex flex="1" alignItems="center" py={8}>
          <Box
            width="100%"
            height="100%"
            px={{
              sm: 6,
              md: 8,
              lg: 12,
            }}
          >
            <Container maxW={maxWidth} px={0}>
              {children}
            </Container>
          </Box>
        </Flex>
        <Flex
          width="100%"
          flexDirection={{ base: 'column-reverse', md: 'row' }}
          justifyContent="space-between"
          gap={4}
        >
          {prevBtnProps && (
            <SecondaryButton
              isDisabled={prevBtnProps.disable || state.prevSteps.length < 1}
              type={prevBtnProps?.type}
              form={prevBtnProps?.idFormSubmit}
              onClick={prevBtnProps?.onClick}
            >
              {prevBtnProps.label || 'Zpět'}
            </SecondaryButton>
          )}
          <Flex
            flex={1}
            justifyContent="flex-end"
            gap={4}
            flexDirection={{ base: 'column-reverse', md: 'row' }}
          >
            {midBtnProps && (
              <SecondaryButton
                type={midBtnProps?.type}
                form={midBtnProps?.idFormSubmit}
                isDisabled={midBtnProps?.disable}
                onClick={midBtnProps?.onClick}
              >
                {midBtnProps?.label}
              </SecondaryButton>
            )}
            {nextBtnProps && (
              <PrimaryButton
                type={nextBtnProps?.type}
                form={nextBtnProps?.idFormSubmit}
                isDisabled={nextBtnProps?.disable}
                onClick={nextBtnProps?.onClick}
              >
                {nextBtnProps.label || 'Další'}
              </PrimaryButton>
            )}
          </Flex>
        </Flex>
      </Flex>
    </Card>
  );
};
