import { useEffect } from 'react';
import { Heading } from '@chakra-ui/react';

import { useEducatorState } from '@frontend/hooks/useEducatorState.ts';
import { useEducatorStorage } from '@frontend/hooks/useEducatorStorage';

import { NotaryIdentificationOutput } from '../../notary-identification/NotaryIdentificationOutput';
import { ResolutionOfInheritance } from '../../resolutionOfInheritance/ResolutionOfInheritance';
import { StepperWrapper } from '../common/StepperWrapper';

export const Step30 = () => {
  const { setPrevState, setState, incrementState } = useEducatorState();
  const { storage, getResult } = useEducatorStorage();

  const result = getResult();

  useEffect(() => {
    if (!storage.identifiedNotary && !result) {
      // this is done to avoid double increment (bz of double render in dev)
      setState(31);
    }
  }, [result, setState, storage.identifiedNotary]);

  return (
    <StepperWrapper
      title={'Shrnutí'}
      showStep={3}
      prevBtnProps={{ onClick: setPrevState }}
      nextBtnProps={{ onClick: incrementState }}
    >
      {storage.identifiedNotary && (
        <>
          <Heading as="h2" textAlign={'center'} size={'md'} mb={8}>
            Kdo bude přiděleným notářem?
          </Heading>
          <NotaryIdentificationOutput hideInfoHintBox hideText />
        </>
      )}
      {result && (
        <>
          <Heading as="h2" textAlign={'center'} size={'md'} mb={8}>
            Jaké bude rozdělení pozůstalosti?
          </Heading>
          <ResolutionOfInheritance result={result} />
        </>
      )}
      {!storage.identifiedNotary && !result && (
        <Heading as="h2" textAlign={'center'} size={'md'} mb={8}>
          Ve shrnutí není možné zobrazit žádné informace.
        </Heading>
      )}
    </StepperWrapper>
  );
};
