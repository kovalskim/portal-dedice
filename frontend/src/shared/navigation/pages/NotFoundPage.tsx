import { route } from '@frontend/route';
import { Box, MainLayout } from '@frontend/shared/design-system';

import { RouterLink } from '../atoms';

export function NotFoundPage() {
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
}
