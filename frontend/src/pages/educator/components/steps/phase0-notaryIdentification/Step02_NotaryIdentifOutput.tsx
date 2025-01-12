import { NotaryIdentificationOutput } from '@frontend/pages/educator/components/notary-identification/NotaryIdentificationOutput.tsx';
import { useEducatorState } from '@frontend/pages/educator/hooks/useEducatorState.ts';

import { StepperWrapper } from '../common/StepperWrapper.tsx';

export const Step02_NotaryIdentifOutput = () => {
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
