import { useEducatorState } from '@frontend/pages/educator/hooks/useEducatorState.ts';
import { useEducatorStorage } from '@frontend/pages/educator/hooks/useEducatorStorage.ts';

import { StepQuestion } from '../common/StepQuestion.tsx';

export const Step24_QuestionTestament = () => {
  const { setState } = useEducatorState();
  const { updateStorage } = useEducatorStorage();

  return (
    <StepQuestion
      question={'Byla zůstavitelem(kou) sepsána závěť?'}
      answers={[
        {
          label: 'Ano',
          action: () => {
            setState(23);
            updateStorage({ hadWill: true });
          },
        },
        {
          label: 'Ne',
          action: () => {
            setState(25);
            updateStorage({ hadWill: false });
          },
        },
      ]}
    />
  );
};
