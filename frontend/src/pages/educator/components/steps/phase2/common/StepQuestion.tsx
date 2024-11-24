import { FC, PropsWithChildren } from 'react';
import { Heading, Stack } from '@chakra-ui/react';

import { PrimaryButton, SecondaryButton } from '@frontend/components/buttons';
import { useEducatorState } from '@frontend/hooks/useEducatorState.ts';

import { StepperWrapper } from '../../common/StepperWrapper.tsx';

type Answer = {
  action: () => void;
  label: string;
};

type StepQuestionProps = {
  question: string;
  answers: Answer[];
};

export const StepQuestion: FC<PropsWithChildren<StepQuestionProps>> = ({
  question,
  answers,
  children,
}) => {
  const { setPrevState } = useEducatorState();

  return (
    <StepperWrapper
      title={
        'Jak funguje rozdělení pozůstalosti v rámci pozůstalostního řízení?'
      }
      showStep={2}
      prevBtnProps={{ onClick: setPrevState }}
    >
      <Stack spacing={10} alignItems="center">
        <Heading as="h2" textAlign={'center'} size={'sm'}>
          {question}
        </Heading>
        {children}
        <Stack spacing={6} width={200}>
          {answers.map((val, index) =>
            index === 0 ? (
              <PrimaryButton key={val.label} onClick={val.action}>
                {val.label}
              </PrimaryButton>
            ) : (
              <SecondaryButton key={val.label} onClick={val.action}>
                {val.label}
              </SecondaryButton>
            ),
          )}
        </Stack>
      </Stack>
    </StepperWrapper>
  );
};
