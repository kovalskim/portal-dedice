import { Box } from '@chakra-ui/layout';
import { Image } from '@chakra-ui/react';

import { RouterLink } from '@frontend/components/navigation/atoms/RouterLink.tsx';
import { Routes } from '@frontend/routes.ts';

export const Logo = () => (
  <RouterLink
    noUnderline
    color="black"
    fontSize="lg"
    fontWeight="bold"
    display="flex"
    alignItems="center"
    to={Routes.home}
  >
    <Image src="/logo.png" width="50px" me="4" />
    <Box lineHeight="shorter" textAlign="left">
      Portál <br />
      dědice
    </Box>
  </RouterLink>
);
