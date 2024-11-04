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

export const Step15 = () => {
  const { incrementState, setPrevState } = useEducatorState();

  return (
    <StepperWrapper
      title={'Jak probíhá dědické řízení?'}
      showStep={1}
      nextBtnProps={{
        onClick: incrementState,
      }}
      prevBtnProps={{ onClick: setPrevState }}
    >
      <SecondPhaseStepper activeStep={1} />
      <Heading as="h3" size="md" textAlign="center" my={8}>
        Co se děje dále ve fázi předběžného šetření?
      </Heading>
      <UnorderedList spacing={4}>
        <ListItem>
          Notář zjišťuje majetku zůstavitele, doptává se institucí a vytváří
          přehled majetku.
        </ListItem>
        <ListItem>
          Dokud není zjištění kompletní, není možné pokračovat v dědickém řízení
          dále.
        </ListItem>
        <ListItem>
          Vyčkejte, až Vás notář kontaktuje s případnými dotazy k doplnění
          majetku.
        </ListItem>
      </UnorderedList>
      <Accordion my={10} allowToggle>
        <AccordionItem py={1}>
          <AccordionButton>
            <Heading as="h4" size="sm" textAlign="left" flex="1">
              Mám něco v této fázi jako pozůstalý podnikat nějaké kroky?
            </Heading>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel>
            Ne, vyčkejte, až vás notář kontaktuje s případnými dotazy k doplnění
            majetku. Notář Vás může případne kontaktovat již kvůli nařízení
            soudního jednání, které je standardně závěrem pozůstalostního
            řízení.
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem py={1}>
          <AccordionButton>
            <Heading as="h4" size="sm" textAlign="left" flex="1">
              Jak dlouho trvá než notář nařídí závěrečné soudní jednání?
            </Heading>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel>
            Na tuto otázku bohužel neexistuje jasná odpověď. Notář postupuje tak
            rychle, jak dokáže zjistit informace o majetku zůstavitele. Je tady
            závislý také na součinnosti bankovních institucí apod. Pokud jde vše
            bez problémů, je možné, že nařídí řízení za 1-2 měsíce po Předběžném
            šetření. Není ale výjimkou, že je tento časový úsek delší.
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </StepperWrapper>
  );
};
