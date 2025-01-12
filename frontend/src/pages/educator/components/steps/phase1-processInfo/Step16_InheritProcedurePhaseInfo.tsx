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

import { InfoHintBox } from '@frontend/components/infoHintBox/InfoHintBox';
import { useEducatorState } from '@frontend/pages/educator/hooks/useEducatorState.ts';

import { SecondPhaseStepper } from '../../secondPhaseStepper/SecondPhaseStepper.tsx';
import { StepperWrapper } from '../common/StepperWrapper.tsx';

export const Step16_InheritProcedurePhaseInfo = () => {
  const { setState, setPrevState } = useEducatorState();

  return (
    <StepperWrapper
      title={'Jak probíhá dědické řízení?'}
      showStep={1}
      nextBtnProps={{
        onClick: () => {
          setState(20);
        },
      }}
      prevBtnProps={{ onClick: setPrevState }}
    >
      <SecondPhaseStepper activeStep={2} />
      <Heading as="h3" size="md" textAlign="center" my={8}>
        Pozůstalostní řízení
      </Heading>
      <InfoHintBox title="Věděli jste, že?">
        Pozůstalostní řízení je soudním jednáním v prvním stupni. Notář
        vystupuje v pozici soudního komisaře.
      </InfoHintBox>
      <UnorderedList spacing={4} pt={8}>
        <ListItem>
          Notář vás bude kontaktovat o nařízení soudního jednání, na kterém se
          řeší rozdělení pozůstalosti.
        </ListItem>
        <ListItem>
          Během tohoto jednání jsou přítomni všichni dědicové (včetně
          pozůstalého manžela/ky).
        </ListItem>
        <ListItem>
          Cílem tohoto jednání je, aby se účastníci řízení dohodli na rozdělení
          majetku v pozůstalosti.
        </ListItem>
      </UnorderedList>
      <Accordion my={10} allowToggle>
        <AccordionItem py={1}>
          <AccordionButton>
            <Heading as="h4" size="sm" textAlign="left" flex="1">
              Je možné nechat se zastoupit na plnou moc?
            </Heading>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel>
            Ano, kontaktuje v tomto případě notáře, který Vám pro tyto účely
            vydá speciální tiskopis plné moci. Současně Vám sdělí, zda je nutné,
            aby měla ověřený podpis.
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </StepperWrapper>
  );
};
