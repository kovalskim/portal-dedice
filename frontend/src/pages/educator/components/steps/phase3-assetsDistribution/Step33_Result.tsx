import { useEffect, useRef } from 'react';
import { Alert, AlertIcon, Heading } from '@chakra-ui/react';

import { InheritanceDistributionResult } from '@frontend/pages/educator/components/assetsDistribution/InheritanceDistributionResult.tsx';
import { StepperWrapper } from '@frontend/pages/educator/components/steps/common/StepperWrapper.tsx';
import { useEducatorState } from '@frontend/pages/educator/hooks/useEducatorState.ts';
import { useEducatorStorage } from '@frontend/pages/educator/hooks/useEducatorStorage.ts';
import { useInheritanceCalculator } from '@frontend/pages/educator/hooks/useInheritanceCalculator.ts';

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
