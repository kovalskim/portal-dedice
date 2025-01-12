import { useEducatorState } from '@frontend/pages/educator/hooks/useEducatorState.ts';

import { StepQuestion } from './common/StepQuestion';

export const Step211_QuestionHeirsAgreement = () => {
  const { setState, incrementState } = useEducatorState();

  return (
    <StepQuestion
      question={'Chcete se dozvědět více o dědické dohodě? '}
      answers={[
        {
          label: 'Ano',
          action: () => {
            incrementState();
          },
        },
        {
          label: 'Ne',
          action: () => {
            setState(30);
          },
        },
      ]}
    />
  );
};
