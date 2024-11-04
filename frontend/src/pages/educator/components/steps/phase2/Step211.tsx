import { useEducatorState } from '@frontend/hooks/useEducatorState';

import { StepQuestion } from './common/StepQuestion';

export const Step211 = () => {
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
