import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Heading,
  ListItem,
  UnorderedList,
} from '@chakra-ui/react';

import { useEducatorState } from '@frontend/hooks/useEducatorState.ts';

import { SecondPhaseStepper } from '../../secondPhaseStepper/SecondPhaseStepper.tsx';
import { StepperWrapper } from '../common/StepperWrapper.tsx';

export const Step14 = () => {
  const { incrementState, setPrevState } = useEducatorState();

  return (
    <StepperWrapper
      title={'Jak probíhá dědické řízení?'}
      nextBtnProps={{
        onClick: incrementState,
        label: 'Co se děje dále?',
      }}
      prevBtnProps={{ onClick: setPrevState }}
      showStep={1}
    >
      <SecondPhaseStepper activeStep={1} />
      <Heading as="h3" size="md" textAlign="center" my={8}>
        Co si mám přinést s sebou na předběžné šetření?
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
      <Accordion my={10} allowToggle>
        <AccordionItem py={1}>
          <AccordionButton>
            <Heading as="h4" size="sm" textAlign="left" flex="1">
              Co když je v pozůstalosti automobil?
            </Heading>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel>
            V takovém případě s sebou na předběžné šetření přineste velký
            technický průkaz vozidla.
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem py={1}>
          <AccordionButton>
            <Heading as="h4" size="sm" textAlign="left" flex="1">
              Co když je v pozůstalosti nemovitost?
            </Heading>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel>
            V takovém případě bude potřeba zajistit odhad nemovitosti. Odhad
            nemovitosti za poplatek zpracuje kterákoliv realitní kancelář.
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </StepperWrapper>
  );
};
