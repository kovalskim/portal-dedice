import { Outlet } from 'react-router-dom';

import { ChakraProvider, theme } from '@frontend/components/design-system';
import { AuthProvider } from '@frontend/context/auth';
import { EnhancedApolloProvider } from '@frontend/utils/apollo.tsx';

export const App = () => {
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <EnhancedApolloProvider>
          <Outlet />
        </EnhancedApolloProvider>
      </AuthProvider>
    </ChakraProvider>
  );
};
