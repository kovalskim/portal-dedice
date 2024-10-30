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

// TODO možno pridať odkaz na registráciu do portálu, keď tu spomíname, že ho môžu využiť

export const Step11 = () => {
  const { incrementState, setPrevState } = useEducatorState();

  return (
    <StepperWrapper
      title={'Jak probíhá dědické řízení?'}
      showStep={1}
      nextBtnProps={{ onClick: incrementState, label: 'Co se děje dále?' }}
      prevBtnProps={{ onClick: setPrevState }}
    >
      <Container px={0}>
        <SecondPhaseStepper activeStep={1} />
        <Heading as="h3" size="md" textAlign="center" my={8}>
          Předběžné šetření
        </Heading>
        <UnorderedList spacing={4}>
          <ListItem>Notář začíná pracovat na dědickém řízení.</ListItem>
          <ListItem>
            Vyčkejte, až vás notář kontaktuje nebo využijte Portál dědice ke
            sledování aktuálního průběhu dědického řízení.
          </ListItem>
        </UnorderedList>
        <Accordion my={10} allowMultiple>
          <AccordionItem>
            <AccordionButton>
              <Heading as="h4" size="xs" textAlign="left" flex="1">
                Co obnáší předběžné šetření?
              </Heading>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel>
              Notář nařizuje predbežné šetření, jehož cílem je zjistit majetek
              zůstavitele a jeho osobní poměry ke dni úmrtí. Notář by měl
              postupovat bezodkladne, ale záleží notář od notáře (Notáři nemají
              stejný počet případů a také jejich složitost a náročnost se různí.
              Proto se může stát, že notáři v řízení postupují jinou rychlostí).
              <br />
              Notář zjišťuje majetek, doptává se institucí, delá přehled
              majetku. Dokud není zjištěn kompletní, není možné pokračovat dále.
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem>
            <AccordionButton>
              <Heading as="h4" size="xs" textAlign="left" flex="1">
                Je součástí předběžného šetření schůzka s notářem? Kdo se jí
                účastní?
              </Heading>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel>
              Ano, jedná se o úvodní setkání s osobou nejbližší zůstaviteli. Při
              závěrečném řízení se mohou účastnit i další osoby, které mají
              zájem na dědictví. Notář se vás bude ptát na majetek zůstavitele,
              jeho osobní poměry a další informace, které mohou být důležité pro
              dědické řízení. Pokud měl zůstavitel manžela/manželku, bude se
              notář ptát i na něj/ní.
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem>
            <AccordionButton>
              <Heading as="h4" size="xs" textAlign="left" flex="1">
                Je třeba dokládat nějaké dokumenty?
              </Heading>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel>
              S sebou si doneste doklad totožnosti, oddací list, závěť, rodné
              listy. Udělejte si přehled v majetkových záležitostech zůstavitele
              (bankovní účty apod.). Pokud je v pozůstalosti automobil, přineste
              velký technický průkaz. Pokud je v pozůstalosti nemovitost, bude
              potřeba zajistit odhad nemovitosti. Tento odhad za poplatek
              spracuje kterákoliv realitní kancelář.
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Container>
    </StepperWrapper>
  );
};
