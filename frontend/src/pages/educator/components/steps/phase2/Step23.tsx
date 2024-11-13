import { useEducatorState } from '@frontend/hooks/useEducatorState.ts';
import { useEducatorStorage } from '@frontend/hooks/useEducatorStorage.ts';

import { ResolutionOfInheritance } from '../../resolutionOfInheritance/ResolutionOfInheritance.tsx';
import { StepperWrapper } from '../common/StepperWrapper.tsx';

export const Step23 = () => {
  const { setState, setPrevState } = useEducatorState();
  const { getResult } = useEducatorStorage();

  const result = getResult();

  return (
    <StepperWrapper
      title={
        'Jak funguje rozdělení pozůstalosti v rámci pozůstalostního řízení?'
      }
      showStep={2}
      prevBtnProps={{ onClick: setPrevState }}
      nextBtnProps={{
        onClick: () => {
          setState(result ? 211 : 30);
        },
      }}
    >
      <ResolutionOfInheritance result={result} />
    </StepperWrapper>
  );
};
