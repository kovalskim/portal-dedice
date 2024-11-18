import { Box } from '@chakra-ui/layout';
import { Image } from '@chakra-ui/react';

import { RouterLink } from '@frontend/components/navigation/atoms/RouterLink.tsx';
import { useAuth } from '@frontend/context/auth';
import { Routes } from '@frontend/routes.ts';

export const Logo = () => {
  const { user } = useAuth();

  return (
    <RouterLink
      noUnderline
      color="black"
      fontSize="lg"
      fontWeight="bold"
      display="flex"
      alignItems="center"
      to={!user ? Routes.home : Routes.proceedings}
    >
      <Image src="/logo.png" width="50px" me="4" />
      <Box lineHeight="shorter" textAlign="left">
        Portál <br />
        dědice
      </Box>
    </RouterLink>
  );
};
