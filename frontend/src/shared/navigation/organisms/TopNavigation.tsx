import { Box, Flex } from '@chakra-ui/layout';
import { Image, useBreakpointValue } from '@chakra-ui/react';

import { useAuth } from '@frontend/modules/auth';
import { route } from '@frontend/route';
import { Stack } from '@frontend/shared/design-system';
import { SecondaryButton } from '@frontend/shared/design-system/atoms/buttons/SecondaryButton.tsx';
import { RouterNavButton } from '@frontend/shared/navigation/atoms/RouterNavButton.tsx';

import { RouterLink, RouterNavLink } from '../atoms';

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
        to={route.home()}
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
        <RouterNavLink to={route.home()}>O portálu</RouterNavLink>
        <RouterNavLink to={route.educator()}>Nachytřovadlo</RouterNavLink>
      </Flex>
      {user === null ? (
        <RouterNavButton
          to={route.signIn()}
          label={navButtonlabel || ''}
        ></RouterNavButton>
      ) : (
        <SecondaryButton
          ml="2"
          onClick={() => signOut()}
          label="Sign out"
        ></SecondaryButton>
      )}
    </Stack>
  );
};
