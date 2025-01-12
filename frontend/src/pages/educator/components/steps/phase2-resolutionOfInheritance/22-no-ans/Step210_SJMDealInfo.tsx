import { Heading, ListItem, Stack, UnorderedList } from '@chakra-ui/react';

import { InfoHintBox } from '@frontend/components/infoHintBox/InfoHintBox';
import { useEducatorState } from '@frontend/pages/educator/hooks/useEducatorState.ts';

import { StepperWrapper } from '../../common/StepperWrapper';

export const Step210_SJMDealInfo = () => {
  const { setState, setPrevState } = useEducatorState();

  return (
    <StepperWrapper
      title={
        'Jak funguje rozdělení pozůstalosti v rámci pozůstalostního řízení?'
      }
      showStep={2}
      prevBtnProps={{ onClick: setPrevState }}
      nextBtnProps={{
        onClick: () => {
          setState(24);
        },
      }}
    >
      <Stack spacing={10}>
        <Heading textAlign={'center'} size={'sm'}>
          Jak ideálně vypořádat SJM?
        </Heading>
        <UnorderedList spacing={6}>
          <ListItem>
            Nechť pozůstalá manželka dostane majetku raději více, pakliže jí
            nečiní obtíže zařídit přepis majetku.
          </ListItem>
          <ListItem>
            Do pozůstalostního řízení pak vstupuje nejméně 1/2 společného jmění
            manželů.
          </ListItem>
        </UnorderedList>
        <InfoHintBox title="Jak je možné, že když manželka dostane hodnotově víc než polovinu SJM, tak se v pozůstalosti objeví právě 1/2 hodnoty?">
          Jedná se o institut náhradové pohledávky, notář může a nemusí tento
          institut využít. Slouží pouze pro lepší pochopení situace.
        </InfoHintBox>
      </Stack>
    </StepperWrapper>
  );
};
