import { BrowserRouter } from 'react-router-dom';

import { ChakraProvider, theme } from '@frontend/components/design-system';
import { AuthProvider } from '@frontend/context/auth';
import { Routes } from '@frontend/Routes';
import { EnhancedApolloProvider } from '@frontend/utils/apollo.tsx';

export const App = () => {
  return (
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <AuthProvider>
          <EnhancedApolloProvider>
            <Routes />
          </EnhancedApolloProvider>
        </AuthProvider>
      </BrowserRouter>
    </ChakraProvider>
  );
};
