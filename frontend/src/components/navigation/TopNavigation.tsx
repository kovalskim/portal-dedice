import { Box, Flex, Stack } from '@chakra-ui/layout';
import { Image, useBreakpointValue } from '@chakra-ui/react';

import { SecondaryButton } from '@frontend/components/buttons/SecondaryButton';
import { RouterNavButton } from '@frontend/components/navigation/atoms/RouterNavButton.tsx';
import { useAuth } from '@frontend/context/auth';
import { Routes } from '@frontend/routes';

import { RouterLink, RouterNavLink } from './atoms';

export const TopNavigation = () => {
  const { user, signOut } = useAuth();

  const navButtonlabel = useBreakpointValue({
    base: 'Přihlásit', // On mobile (base and sm), show just "Přihlásit"
    md: 'Přihlásit se do Portálu dědice', // On medium and larger, show full text
  });

  return (
    <Stack
      bg="white"
      py="4"
      mx="10"
      direction="row"
      spacing="0"
      alignItems="center"
      display="flex"
      justifyContent="space-between"
    >
      <RouterLink
        noUnderline
        color="black"
        fontSize="lg"
        fontWeight="bold"
        display="flex"
        alignItems="center"
        to={Routes.home}
      >
        <Image src={'/logo.png'} width="60px" me="4"></Image>
        <Box lineHeight="shorter" textAlign="left">
          Portál <br />
          dědice
        </Box>
      </RouterLink>
      <Flex
        direction={{
          base: 'column',
          md: 'row',
        }}
        alignItems={{
          base: 'center',
        }}
        gap={{
          base: 0,
          md: 6,
        }}
      >
        <RouterNavLink to={Routes.home}>O portálu</RouterNavLink>
        <RouterNavLink to={Routes.educator}>Nachytřovadlo</RouterNavLink>
      </Flex>
      {user === null ? (
        <RouterNavButton to={Routes.signIn}>
          {navButtonlabel || ''}
        </RouterNavButton>
      ) : (
        <SecondaryButton ml="2" onClick={() => signOut()}>
          Sign out
        </SecondaryButton>
      )}
    </Stack>
  );
};
