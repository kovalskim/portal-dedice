import { useEffect } from 'react';
import { Box } from '@chakra-ui/layout';
import { Heading } from '@chakra-ui/react';

import { useEducatorState } from '@frontend/hooks/useEducatorState.ts';
import { useEducatorStorage } from '@frontend/hooks/useEducatorStorage.ts';
import { InheritanceDistributionResult } from '@frontend/pages/educator/components/steps/phase3/InheritanceDistributionResult.tsx';

import { NotaryIdentificationOutput } from '../../notary-identification/NotaryIdentificationOutput.tsx';
import { ResolutionOfInheritance } from '../../resolutionOfInheritance/ResolutionOfInheritance.tsx';
import { StepperWrapper } from '../common/StepperWrapper.tsx';

export const Step40 = () => {
  const { setPrevState, setState, incrementState } = useEducatorState();
  const { storage, getResult } = useEducatorStorage();

  const resolutionInheritanceResult = getResult();

  useEffect(() => {
    if (
      !storage.identifiedNotary &&
      !resolutionInheritanceResult &&
      !storage.assetsDistributionResult
    ) {
      // this is done to avoid double increment (bz of double render in dev)
      setState(41);
    }
  }, [
    resolutionInheritanceResult,
    setState,
    storage.assetsDistributionResult,
    storage.identifiedNotary,
  ]);

  return (
    <StepperWrapper
      title={'Shrnutí'}
      showStep={4}
      prevBtnProps={{ onClick: setPrevState }}
      nextBtnProps={{ onClick: incrementState }}
    >
      {storage.identifiedNotary && (
        <Box mb={8}>
          <Heading as="h2" textAlign={'center'} size={'md'} mb={6}>
            Kdo bude přiděleným notářem?
          </Heading>
          <NotaryIdentificationOutput hideInfoHintBox hideText />
        </Box>
      )}
      {resolutionInheritanceResult && (
        <Box mb={8}>
          <Heading as="h2" textAlign={'center'} size={'md'} mb={6}>
            Jaké bude rozdělení pozůstalosti?
          </Heading>
          <ResolutionOfInheritance result={resolutionInheritanceResult} />
        </Box>
      )}
      {storage.assetsDistribution?.heirs &&
        storage.assetsDistributionResult && (
          <Box mb={8}>
            <Heading as="h2" textAlign={'center'} size={'md'} mb={6}>
              Rozdělení pozůstalosti
            </Heading>
            <InheritanceDistributionResult
              heirs={storage?.assetsDistribution?.heirs}
              result={storage?.assetsDistributionResult}
            />
          </Box>
        )}
      {!storage.identifiedNotary &&
        !resolutionInheritanceResult &&
        !storage.assetsDistributionResult && (
          <Heading as="h2" textAlign={'center'} size={'md'} mb={6}>
            Ve shrnutí není možné zobrazit žádné informace.
          </Heading>
        )}
    </StepperWrapper>
  );
};
