import { useEducatorState } from '@frontend/pages/educator/hooks/useEducatorState.ts';
import { useEducatorStorage } from '@frontend/pages/educator/hooks/useEducatorStorage.ts';

import { StepQuestion } from '../../common/StepQuestion';

export const Step25_QuestionHasChildren = () => {
  const { incrementState, setState } = useEducatorState();
  const { updateStorage } = useEducatorStorage();

  return (
    <StepQuestion
      question={'Měl zůstavitel potomky?'}
      answers={[
        {
          label: 'Ano',
          action: () => {
            incrementState();
            updateStorage({ hadKids: true });
          },
        },
        {
          label: 'Ne',
          action: () => {
            setState(27);
            updateStorage({ hadKids: false });
          },
        },
      ]}
    />
  );
};
