import { useEducatorState } from '@frontend/hooks/useEducatorState.ts';
import { useEducatorStorage } from '@frontend/hooks/useEducatorStorage.ts';

import { StepQuestion } from '../../../common/StepQuestion';

export const Step28 = () => {
  const { setState } = useEducatorState();
  const { updateStorage } = useEducatorStorage();

  return (
    <StepQuestion
      question={
        'Žil se zůstavitelem ve společné domácnosti po dobu jednoho roku před smrtí někdo další?'
      }
      answers={[
        {
          label: 'Ano',
          action: () => {
            setState(23);
            updateStorage({ livedWithSomeone: true });
          },
        },
        {
          label: 'Ne',
          action: () => {
            setState(23);
            updateStorage({ livedWithSomeone: false });
          },
        },
      ]}
    />
  );
};
