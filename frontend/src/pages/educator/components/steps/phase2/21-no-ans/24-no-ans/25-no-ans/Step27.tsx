import { useEducatorState } from '@frontend/hooks/useEducatorState.ts';
import { useEducatorStorage } from '@frontend/hooks/useEducatorStorage.ts';

import { StepQuestion } from '../../../common/StepQuestion';

export const Step27 = () => {
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
