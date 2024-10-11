import { BrowserRouter } from 'react-router-dom';

import { ChakraProvider, theme } from '@frontend/components/design-system';
import { AuthProvider } from '@frontend/context/auth';
import { EnhancedApolloProvider } from '@frontend/utils/apollo.tsx';

import { Router } from './Router';

export const App = () => {
  return (
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <AuthProvider>
          <EnhancedApolloProvider>
            <Router />
          </EnhancedApolloProvider>
        </AuthProvider>
      </BrowserRouter>
    </ChakraProvider>
  );
};
