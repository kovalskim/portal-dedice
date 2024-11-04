import { useEducatorState } from '@frontend/hooks/useEducatorState.ts';
import { useEducatorStorage } from '@frontend/hooks/useEducatorStorage.ts';

import { StepQuestion } from './common/StepQuestion.tsx';

export const Step21 = () => {
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
