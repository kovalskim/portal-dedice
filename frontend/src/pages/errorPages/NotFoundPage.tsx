import { Box } from '@chakra-ui/react';

import { Routes } from '@frontend/routes/routes.ts';

import { RouterLink } from '../../components/navigation/atoms';

export const NotFoundPage = () => {
  return (
    <Box p="8">
      <Box>
        Page not found, please return to{' '}
        <RouterLink to={Routes.home}>Home</RouterLink>.
      </Box>
    </Box>
  );
};
