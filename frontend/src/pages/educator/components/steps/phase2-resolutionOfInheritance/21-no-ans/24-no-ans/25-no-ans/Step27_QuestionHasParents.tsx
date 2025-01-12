import { useEducatorState } from '@frontend/pages/educator/hooks/useEducatorState.ts';
import { useEducatorStorage } from '@frontend/pages/educator/hooks/useEducatorStorage.ts';

import { StepQuestion } from '../../../common/StepQuestion';

export const Step27_QuestionHasParents = () => {
  const { incrementState } = useEducatorState();
  const { updateStorage } = useEducatorStorage();

  return (
    <StepQuestion
      question={'Měl zůstavitel v době úmrtí rodiče?'}
      answers={[
        {
          label: 'Ano',
          action: () => {
            incrementState();
            updateStorage({ hadParents: true });
          },
        },
        {
          label: 'Ne',
          action: () => {
            incrementState();
            updateStorage({ hadParents: false });
          },
        },
      ]}
    />
  );
};
