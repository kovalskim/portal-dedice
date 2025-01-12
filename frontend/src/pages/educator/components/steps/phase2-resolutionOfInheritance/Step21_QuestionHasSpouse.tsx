import { useEducatorState } from '@frontend/pages/educator/hooks/useEducatorState.ts';
import { useEducatorStorage } from '@frontend/pages/educator/hooks/useEducatorStorage.ts';

import { StepQuestion } from './common/StepQuestion.tsx';

export const Step21_QuestionHasSpouse = () => {
  const { setState, incrementState } = useEducatorState();
  const { updateStorage } = useEducatorStorage();

  return (
    <StepQuestion
      question={'Měl zůstavitel manžela/ku?'}
      answers={[
        {
          label: 'Ano',
          action: () => {
            incrementState();
            updateStorage({ married: true });
          },
        },
        {
          label: 'Ne',
          action: () => {
            setState(24);
            updateStorage({ married: false });
          },
        },
      ]}
    />
  );
};
