import { Heading, ListItem, Stack, UnorderedList } from '@chakra-ui/react';

import { InfoHintBox } from '@frontend/components/index.ts';
import { useEducatorState } from '@frontend/hooks/useEducatorState.ts';

import { StepperWrapper } from '../common/StepperWrapper';

export const Step212 = () => {
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
          setState(30);
        },
      }}
    >
      <Stack spacing={10}>
        <Heading textAlign={'center'} size={'sm'}>
          Dědická dohoda
        </Heading>
        <InfoHintBox title="Co je dědická dohoda?">
          Dědická dohoda (také nazývaná dohoda o vypořádání dědictví) je právní
          dokument nebo ujednání mezi dědici, které stanoví, jak bude rozdělen
          majetek zůstavitele (zemřelého) mezi dědice
        </InfoHintBox>
        <UnorderedList spacing={6}>
          <ListItem>
            Dědicům sice náleží rovný díl hodnoty majetku pozůstalosti, ale
            mohou se v případě shody domluvit o rozdělení majetku jinak.
          </ListItem>
          <ListItem>
            Dědicové si mohou určit vlastní dědické podíly (např. podíly 90% ku
            10% nebo vše jeden, ostatní nic).
          </ListItem>
          <ListItem>Notář bude jakoukoliv vaší dohodu respektovat.</ListItem>
        </UnorderedList>
      </Stack>
    </StepperWrapper>
  );
};
