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

import { InfoHintBox } from '@frontend/components';
import { Link } from '@frontend/components/links';
import { useEducatorState } from '@frontend/hooks/useEducatorState.ts';
import { Routes } from '@frontend/routes.ts';

import { SecondPhaseStepper } from '../../secondPhaseStepper/SecondPhaseStepper.tsx';
import { StepperWrapper } from '../common/StepperWrapper.tsx';

// TODO možno pridať odkaz na registráciu do portálu, keď tu spomíname, že ho môžu využiť

export const Step12 = () => {
  const { incrementState, setPrevState } = useEducatorState();

  return (
    <StepperWrapper
      title={'Jak probíhá dědické řízení?'}
      showStep={1}
      nextBtnProps={{
        onClick: incrementState,
        label: 'Co obnáší předběžné šetření?',
      }}
      prevBtnProps={{ onClick: setPrevState }}
    >
      <SecondPhaseStepper activeStep={1} />
      <Heading as="h3" size="md" textAlign="center" my={8}>
        Předběžné šetření
      </Heading>
      <InfoHintBox title="Věděli jste, že?">
        Díky službám Portálu dědice můžete celé předběžné šetření sledovat a
        vyřizovat online z pohodlí domova. Přihlaste se{' '}
        <Link href={Routes.logIn} isInsideInfoHintBox={true}>
          zde
        </Link>
        .
      </InfoHintBox>
      <UnorderedList spacing={4} mt={4}>
        <ListItem>
          Notář začíná pracovat na dědickém řízení a nařizuje předběžné šetření.
        </ListItem>
        <ListItem>
          Vyčkejte, až Vás notář kontaktuje nebo využijte Portál dědice ke
          sledování aktuálního průběhu dědického řízení.
        </ListItem>
      </UnorderedList>
      <Accordion my={10} allowToggle>
        <AccordionItem py={1}>
          <AccordionButton>
            <Heading as="h4" size="sm" textAlign="left" flex="1">
              Jak je možné, že délka dědických řízení či rychlost notářů jsou
              odlišné?
            </Heading>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel>
            Notáři nemají stejný počet případů a také jejich složitost a
            náročnost se různí. Proto se může stát, že notáři v řízení postupují
            s jinou rychlostí.
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem py={1}>
          <AccordionButton>
            <Heading as="h4" size="sm" textAlign="left" flex="1">
              Je součástí předběžného šetření schůzka s notářem? Kdo se jí
              účastní?
            </Heading>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel>
            Jedná se o úvodní setkání s osobou nejbližší zůstaviteli. Při
            závěrečném řízení již budou účastni všichni dědicové.
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </StepperWrapper>
  );
};
