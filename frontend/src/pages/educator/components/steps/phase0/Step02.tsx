import { useEducatorState } from '@frontend/hooks/useEducatorState.ts';
import { NotaryIdentificationOutput } from '@frontend/pages/educator/components/notary-identification/NotaryIdentificationOutput.tsx';

import { StepperWrapper } from '../common/StepperWrapper.tsx';

export const Step02 = () => {
  const { setState, setPrevState } = useEducatorState();

  return (
    <StepperWrapper
      title={'Který notář bude pověřen vedením dědického řízení?'}
      showStep={0}
      nextBtnProps={{ onClick: () => setState(10) }}
      prevBtnProps={{ onClick: setPrevState }}
    >
      <NotaryIdentificationOutput />
    </StepperWrapper>
  );
};
