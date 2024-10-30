import { useEducatorState } from '@frontend/hooks/useEducatorState';
import { NotaryIdentificationOutput } from '@frontend/pages/educator/components/notary-identification/NotaryIdentificationOutput.tsx';

import { StepperWrapper } from './common/StepperWrapper';

export const Step02 = () => {
  const { incrementState, setPrevState } = useEducatorState();

  return (
    <StepperWrapper
      title={'Který notář bude pověřen vedením dědického řízení?'}
      showStep={0}
      nextBtnProps={{ onClick: incrementState }}
      prevBtnProps={{ onClick: setPrevState }}
    >
      <NotaryIdentificationOutput />
    </StepperWrapper>
  );
};
