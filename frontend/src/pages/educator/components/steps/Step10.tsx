import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Container,
  Heading,
  ListItem,
  UnorderedList,
} from '@chakra-ui/react';

import { useEducatorState } from '@frontend/hooks/useEducatorState';

import { SecondPhaseStepper } from '../secondPhaseStepper/SecondPhaseStepper';

import { StepperWrapper } from './common/StepperWrapper';

export const Step10 = () => {
  const { incrementState, setPrevState } = useEducatorState();

  return (
    <StepperWrapper
      title={'Jak probíhá dědické řízení?'}
      showStep={1}
      nextBtnProps={{ onClick: incrementState, label: 'Co se děje dále?' }}
      prevBtnProps={{ onClick: setPrevState }}
    >
      <Container px={0}>
        <SecondPhaseStepper activeStep={0} />
        <Heading as="h3" size="md" textAlign="center" my={8}>
          Úvodní fáze
        </Heading>
        <UnorderedList spacing={4}>
          <ListItem>
            Úmrtní list s označeným vypravitelem pohřbu je odeslán na matriku.
          </ListItem>
          <ListItem>
            Místně příslušný soud pověří notáře vedením dědického řízení.
          </ListItem>
          <ListItem>
            Notář si na soudu vyzvedává příslušný spis a začíná na dědickém
            řízení pracovat.
          </ListItem>
        </UnorderedList>
        <Accordion my={10} allowMultiple>
          <AccordionItem>
            <AccordionButton>
              <Heading as="h4" size="xs" textAlign="left" flex="1">
                Předběžné šetření
              </Heading>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel>Může to trvat až jeden měsíc.</AccordionPanel>
          </AccordionItem>
          <AccordionItem>
            <AccordionButton>
              <Heading as="h4" size="xs" textAlign="left" flex="1">
                Mám jako pozůstalý sám v této fázi podnikat nějaké kroky?
              </Heading>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel>
              Ne, v této fázi je vše na notáři. Vyčkejte pridelený notář vás
              bude kontaktovat.
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Container>
    </StepperWrapper>
  );
};
