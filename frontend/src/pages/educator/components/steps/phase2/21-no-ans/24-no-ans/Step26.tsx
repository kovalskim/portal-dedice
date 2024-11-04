import { useEducatorState } from '@frontend/hooks/useEducatorState.ts';
import { useEducatorStorage } from '@frontend/hooks/useEducatorStorage.ts';

import { StepQuestion } from '../../common/StepQuestion';

export const Step26 = () => {
  const { setState } = useEducatorState();
  const { updateStorage } = useEducatorStorage();

  return (
    <StepQuestion
      question={'Kolik měl zůstavitel potomků?'}
      answers={[
        {
          label: '1 potomka',
          action: () => {
            setState(23);
            updateStorage({ numberOfKids: 'one' });
          },
        },
        {
          label: '2 a více potomků',
          action: () => {
            setState(23);
            updateStorage({ numberOfKids: 'many' });
          },
        },
      ]}
    />
  );
};
