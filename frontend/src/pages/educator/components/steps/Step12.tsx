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

import { InfoHintBox } from '@frontend/components';
import { useEducatorState } from '@frontend/hooks/useEducatorState';

import { SecondPhaseStepper } from '../secondPhaseStepper/SecondPhaseStepper';

import { StepperWrapper } from './common/StepperWrapper';

export const Step12 = () => {
  const { incrementState, setPrevState } = useEducatorState();

  return (
    <StepperWrapper
      title={'Jak probíhá dědické řízení?'}
      showStep={1}
      onNext={incrementState}
      onPrev={setPrevState}
    >
      <Container px={0}>
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
            Notář vás bude kontaktovat o nařízení soudního jednání, kde se bude
            řešit rozdělení pozůstalosti.
          </ListItem>
          <ListItem>
            Před pozůstalostním řízením byste jako pozůstalí měli mít představu
            o rozdělení majetku zůstavitele.
          </ListItem>
        </UnorderedList>
        <Accordion my={10} allowMultiple>
          <AccordionItem>
            <AccordionButton>
              <Heading as="h4" size="xs" textAlign="left" flex="1">
                Jak dlouho trvá než notář toto jednání nařídí?
              </Heading>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel>
              Na tuto otázku bohužel neexistuje jasná odpověď. Notář postupuje
              tak rychle, jak dokáže zjistit informace o majetku zůstavitele. Je
              tady závislý také na součinnosti bankovních institucí apod. Pokud
              jde vše bez problému, je možné, že nařídí řízeni za 1-2 měsíce po
              Předběžném šetrení. Není ale výjimkou, že je tento časový úsek
              delší.
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem>
            <AccordionButton>
              <Heading as="h4" size="xs" textAlign="left" flex="1">
                Co obnáší soudní jednání?
              </Heading>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel>
              Během tohoto jednání jsou přítomní vsichni dědicové, vc. pozůstalé
              manželky. Cílem je, aby se tito účastníci dohodli na rozdelení
              majetku v pozůstalosti
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem>
            <AccordionButton>
              <Heading as="h4" size="xs" textAlign="left" flex="1">
                Je možné se nechat zastoupit na plnou moc?
              </Heading>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel>
              Ano, kontaktuje v tomto případe notáře, který Vám pro tyto účely
              vydá špeciálni tiskopis plné moci. Současně Vám sdělí, zda je
              nutné, aby měla ověřeny podpis.
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Container>
    </StepperWrapper>
  );
};
