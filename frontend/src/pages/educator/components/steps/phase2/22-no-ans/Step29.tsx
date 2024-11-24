import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Heading,
  ListItem,
  Text,
  UnorderedList,
} from '@chakra-ui/react';

import { InfoHintBox } from '@frontend/components/infoHintBox/InfoHintBox';
import { useEducatorState } from '@frontend/hooks/useEducatorState.ts';

import { StepperWrapper } from '../../common/StepperWrapper';

export const Step29 = () => {
  const { setState, setPrevState } = useEducatorState();

  return (
    <StepperWrapper
      title={'Jak probíhá dědické řízení?'}
      nextBtnProps={{
        onClick: () => {
          setState(210);
        },
        label: 'Jak SJM vypořádat?',
      }}
      prevBtnProps={{ onClick: setPrevState }}
      showStep={1}
    >
      <Heading as="h3" size={'sm'} textAlign="center" my={8}>
        Standardní společné jmění manželů (SJM)
      </Heading>
      <UnorderedList spacing={4}>
        <ListItem>
          Pozůstalý/á manžel/ka získává 1/2 celkové hodnoty společného majetku
        </ListItem>
        <ListItem>
          Zbylá 1/2 celkové hodnoty majetku vstupuje do pozůstalostního řízení.
        </ListItem>
      </UnorderedList>
      <Accordion my={10} allowToggle>
        <AccordionItem py={1}>
          <AccordionButton>
            <Heading as="h4" size="sm" textAlign="left" flex="1">
              Jak určit, který majetek půjde manželovi(ce) a který do
              pozůstalosti?
            </Heading>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel>
            Typicky majetek, který je psán na jméno manželky je ponechán
            manželce.
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem py={1}>
          <AccordionButton>
            <Heading as="h4" size="sm" textAlign="left" flex="1">
              Může manžel/ka dostat všechen majetek?
            </Heading>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel>
            <Text mb={2}>
              Má-li získat všechen majetek manželka, musí si být jistá, že může
              dědice vyplatit. Také to znamená, že musí všechny příslušné
              instituce obejít, aby na sebe majetek přepsala (např. bankovní
              účty).
            </Text>
            <InfoHintBox title="Věděli jste, že...?">
              Věděli jste, že katastr nemovitostí za vás ze zákona řeší notář a
              kolek pro přepis neplatíte, ani na katastr nemovitostí nemusíte?
            </InfoHintBox>
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem py={1}>
          <AccordionButton>
            <Heading as="h4" size="sm" textAlign="left" flex="1">
              Musí manžel/ka dědice vyplácet?
            </Heading>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel>
            Nemusí, pokud se v rámci dědické dohody domluví, že dědicové žádnou
            výplatu nechtějí.
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem py={1}>
          <AccordionButton>
            <Heading as="h4" size="sm" textAlign="left" flex="1">
              Je možné vypořádání SJM nedělat?
            </Heading>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel>
            Možné to je, ale tuto variantu nedoporučujeme. Zvyšujete tím hodnotu
            pozůstalosti a tím pádem i hodnotu, ze které se počítá odměna
            notáře.
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </StepperWrapper>
  );
};
