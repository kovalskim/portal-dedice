import { Box } from '@chakra-ui/react';

import { MainLayout } from '@frontend/components';
import { route } from '@frontend/route';

import { RouterLink } from '../../components/navigation/atoms';

export const NotFoundPage = () => {
  return (
    <MainLayout>
      <Box p="8">
        <Box>
          Page not found, please return to{' '}
          <RouterLink to={route.home()}>Home</RouterLink>.
        </Box>
      </Box>
    </MainLayout>
  );
};
