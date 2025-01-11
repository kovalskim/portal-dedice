import React from 'react';
import { OrderedList } from '@chakra-ui/icons';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Heading,
  ListItem,
} from '@chakra-ui/react';

import { useEducatorState } from '@frontend/hooks/useEducatorState.ts';
import { useEducatorStorage } from '@frontend/hooks/useEducatorStorage.ts';
import { AssetsIdentificationForm } from '@frontend/pages/educator/components/assetsDistribution/AssetsIdentificationForm.tsx';
import { AssetsIdentificationFormFields } from '@frontend/pages/educator/components/assetsDistribution/assetsIdentificationFormSchema.ts';
import { StepperWrapper } from '@frontend/pages/educator/components/steps/common/StepperWrapper.tsx';

export const Step32_AssetsIdentification = () => {
  const { incrementState, setPrevState } = useEducatorState();
  const { storage, updateStorage } = useEducatorStorage();

  const handleSubmit = (formData: AssetsIdentificationFormFields) => {
    updateStorage({
      assetsDistribution: {
        ...storage.assetsDistribution,
        assets: formData.assets,
      },
    });
    incrementState();
  };

  return (
    <StepperWrapper
      title={'Chcete si vyzkoušet, jak funguje rozdělení pozůstalosti v praxi?'}
      showStep={3}
      prevBtnProps={{ onClick: setPrevState }}
      nextBtnProps={{
        idFormSubmit: 'assetsIdentificationForm',
        type: 'submit',
      }}
      maxWidth="container.xl"
    >
      <Heading as="h3" size="md" textAlign="center" my={8}>
        Krok 2: Určení majetku
      </Heading>
      <AssetsIdentificationForm
        id="assetsIdentificationForm"
        onSubmit={handleSubmit}
        defaultValues={storage.assetsDistribution?.assets}
      />
      <Accordion my={3} allowToggle>
        <AccordionItem py={1}>
          <AccordionButton>
            <Heading as="h4" size="sm" textAlign="left" flex="1">
              Jak postupovat?
            </Heading>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel>
            <OrderedList mt={2}>
              <ListItem>
                Přidávejte další položky pomocí ikony <b>+</b>.
              </ListItem>
              <ListItem>
                Název, tedy popis položky slouží k Vaší orientaci (není
                povinný).
              </ListItem>
              <ListItem>
                V případě, že zůstavitel/ka má uzavřené manželství, je potřeba
                uvést též majetek pozůstalé/ho manžela/manželky, který spadá do
                SJM (viz níže). Výlučný majetek pozůstalé/ho manžela/manželky
                zde neuvádějte.
              </ListItem>
              <ListItem>
                SJM (Společné jmění manželů): V případě že majetek nabyli
                manželé za trvání manželství, tak spadá do SJM (ledaže mají SJM
                zúžené). To platí i pro účty, které jsou sice vedené na jméno
                jednoho z manželů. Majetek nepatří do SJM pouze v případě, že
                jej zůstavitel/ka (nebo manžel/ka) získal/a před uzavřením
                manželství, nebo během manželství např. darem, nebo v rámci
                dědictví. Použijte křížek ve sloupci SJM k určení, že majetek je
                výlučným majetkem zůstavitele/zůstavitelky.
              </ListItem>
            </OrderedList>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </StepperWrapper>
  );
};
