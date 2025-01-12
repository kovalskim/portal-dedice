import { Heading, ListItem, UnorderedList } from '@chakra-ui/react';

import { useEducatorState } from '@frontend/pages/educator/hooks/useEducatorState.ts';

import { SecondPhaseStepper } from '../../secondPhaseStepper/SecondPhaseStepper.tsx';
import { StepperWrapper } from '../common/StepperWrapper.tsx';

export const Step13_InvestigPhaseMeaning = () => {
  const { incrementState, setPrevState } = useEducatorState();

  return (
    <StepperWrapper
      title={'Jak probíhá dědické řízení?'}
      showStep={1}
      nextBtnProps={{
        onClick: incrementState,
        label: 'Co si mám přinést s sebou?',
      }}
      prevBtnProps={{ onClick: setPrevState }}
    >
      <SecondPhaseStepper activeStep={1} />
      <Heading as="h3" size="md" textAlign="center" my={8}>
        Co obnáší předběžné šetření?
      </Heading>
      <UnorderedList spacing={4}>
        <ListItem>
          Notář se Vás bude ptát na majetek, který zůstavitel vlastnil ke dni
          úmrtí (především na to, kde měl bankovní účty atd).
        </ListItem>
        <ListItem>
          Pokud měl zůstavitel v době úmrtí manželku, bude se ptát na stejné
          dotazy i vzhledem k její osobě.
        </ListItem>
      </UnorderedList>
    </StepperWrapper>
  );
};
