import { ListItem, Stack, UnorderedList } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

import { PrimaryButton, SecondaryButton } from '@frontend/components/buttons';
import { useEducatorState } from '@frontend/pages/educator/hooks/useEducatorState.ts';
import { useEducatorStorage } from '@frontend/pages/educator/hooks/useEducatorStorage.ts';
import { Routes } from '@frontend/routes/routes.ts';

import { StepperWrapper } from '../common/StepperWrapper.tsx';

export const Step41_Ending = () => {
  const { setPrevState, resetState } = useEducatorState();
  const { resetStorage } = useEducatorStorage();
  const nav = useNavigate();

  return (
    <StepperWrapper
      title={'Řešíte aktuálně pozůstalostní řízení?'}
      showStep={4}
      prevBtnProps={{ onClick: setPrevState }}
    >
      <Stack spacing={10} alignItems="center">
        <UnorderedList spacing={6}>
          <ListItem>Přihlašte se do Portálu dědice.</ListItem>
          <ListItem>
            Komunikujte s notářem pověřeným vedením dědického řízení.
          </ListItem>
          <ListItem>
            Vyřešte všechny náležitosti včetně rozdělení majetku a odhadu odměny
            notáře online z pohodlí domova.
          </ListItem>
        </UnorderedList>
        <PrimaryButton
          onClick={() => {
            nav(Routes.logIn);
          }}
          width={{ sm: '100%', md: 300 }}
        >
          Přihlásit do Portálu dědice
        </PrimaryButton>
        <SecondaryButton
          onClick={() => {
            resetState();
            resetStorage();
          }}
          width={{ sm: '100%', md: 300 }}
        >
          Začít znovu
        </SecondaryButton>
      </Stack>
    </StepperWrapper>
  );
};
