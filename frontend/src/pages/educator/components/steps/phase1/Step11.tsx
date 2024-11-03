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

import { useEducatorState } from '@frontend/hooks/useEducatorState.ts';

import { SecondPhaseStepper } from '../../secondPhaseStepper/SecondPhaseStepper.tsx';
import { StepperWrapper } from '../common/StepperWrapper.tsx';

export const Step11 = () => {
  const { incrementState, setPrevState } = useEducatorState();

  return (
    <StepperWrapper
      title={'Jak probíhá dědické řízení?'}
      showStep={1}
      nextBtnProps={{ onClick: incrementState, label: 'Co se děje dále?' }}
      prevBtnProps={{ onClick: setPrevState }}
    >
      <Container maxW="container.md">
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
        <Accordion my={10} allowToggle>
          <AccordionItem py={1}>
            <AccordionButton>
              <Heading as="h4" size="sm" textAlign="left" flex="1">
                Jak dlouho trvá, než se spis dostane k notáři?
              </Heading>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel>Může to trvat až jeden měsíc.</AccordionPanel>
          </AccordionItem>
          <AccordionItem py={1}>
            <AccordionButton>
              <Heading as="h4" size="sm" textAlign="left" flex="1">
                Mám jako pozůstalý sám v této fázi podnikat nějaké kroky?
              </Heading>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel>
              Ne, v této fázi je vše na notáři. Vyčkejte, přidělený notář vás
              bude kontaktovat.
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Container>
    </StepperWrapper>
  );
};
