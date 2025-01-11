import { useEffect, useRef } from 'react';
import { Alert, AlertIcon, Heading } from '@chakra-ui/react';

import { useEducatorState } from '@frontend/hooks/useEducatorState.ts';
import { useEducatorStorage } from '@frontend/hooks/useEducatorStorage.ts';
import { StepperWrapper } from '@frontend/pages/educator/components/steps/common/StepperWrapper.tsx';
import { InheritanceDistributionResult } from '@frontend/pages/educator/components/steps/phase3/InheritanceDistributionResult.tsx';
import { useInheritanceCalculator } from '@frontend/pages/educator/components/steps/phase3/useInheritanceCalculator.ts';

export const Step33_Result = () => {
  const isStorageUpdated = useRef(false);

  const { setPrevState, setState } = useEducatorState();
  const { storage, updateStorage } = useEducatorStorage();

  const heirs = storage?.assetsDistribution?.heirs ?? null;
  const assets = storage?.assetsDistribution?.assets ?? null;

  const { result } = useInheritanceCalculator(heirs, assets);

  useEffect(() => {
    if (!isStorageUpdated.current && result) {
      updateStorage({
        assetsDistributionResult: result,
      });
      isStorageUpdated.current = true;
    }
  }, [result, updateStorage, isStorageUpdated]);

  return (
    <StepperWrapper
      title={'Chcete si vyzkoušet, jak funguje rozdělení pozůstalosti v praxi?'}
      showStep={3}
      prevBtnProps={{ onClick: setPrevState }}
      nextBtnProps={{
        onClick: () => setState(40),
      }}
      maxWidth="container.xl"
    >
      <Heading as="h3" size="md" textAlign="center" my={8}>
        Výsledek (dynamická kalkulačka)
      </Heading>
      {heirs && result ? (
        <InheritanceDistributionResult heirs={heirs} result={result} />
      ) : (
        <Alert status="error">
          <AlertIcon />
          Při výpočtu rozdělení majetku se vyskytla chyba.
        </Alert>
      )}
    </StepperWrapper>
  );
};
