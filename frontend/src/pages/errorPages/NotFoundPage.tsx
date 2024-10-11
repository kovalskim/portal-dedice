import { Box } from '@chakra-ui/react';

import { route } from '@frontend/route';

import { RouterLink } from '../../components/navigation/atoms';

export const NotFoundPage = () => {
  return (
    <Box p="8">
      <Box>
        Page not found, please return to{' '}
        <RouterLink to={route.home()}>Home</RouterLink>.
      </Box>
    </Box>
  );
};
