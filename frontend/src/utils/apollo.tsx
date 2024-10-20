import 'cross-fetch/polyfill';

import { ReactNode, useCallback, useMemo } from 'react';
import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  from,
  InMemoryCache,
} from '@apollo/client';
import { NetworkError } from '@apollo/client/errors';
import { onError } from '@apollo/client/link/error';
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs';
import { GraphQLFormattedError } from 'graphql';
import { useNavigate } from 'react-router-dom';

import { config } from '@frontend/config';
import { useAuth } from '@frontend/context/auth';
import { Routes } from '@frontend/routes';

type Props = {
  children: ReactNode;
};

export const EnhancedApolloProvider = ({ children }: Props) => {
  const navigate = useNavigate();
  const { token, signOut } = useAuth();

  const handleSignOut = useCallback(() => {
    signOut();
    navigate(Routes.logIn);
    window.location.reload();
  }, [signOut, navigate]);

  const authLink = new ApolloLink((operation, forward) => {
    operation.setContext({
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
    });

    return forward(operation);
  });

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    //  auth error handling
    if (
      hasUnauthenticatedErrorCode(graphQLErrors) ||
      hasNetworkStatusCode(networkError, 401)
    ) {
      handleSignOut();
    }
    // if 50x - throw error to catch it with react router dom error boundary
    if (
      networkError &&
      'statusCode' in networkError &&
      networkError.statusCode >= 500
    ) {
      throw networkError;
    }
  });

  const cache = useMemo(() => new InMemoryCache(), []);

  const client = new ApolloClient({
    link: from([errorLink, authLink, uploadLink]),
    cache,
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network',
      },
      query: {
        notifyOnNetworkStatusChange: true,
        fetchPolicy: 'cache-first',
      },
    },
    connectToDevTools: process.env.NODE_ENV === 'development',
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

const UNAUTHENTICATED_CODE = 'UNAUTHENTICATED';

const hasUnauthenticatedErrorCode = (
  errors: readonly GraphQLFormattedError[] | undefined,
) => {
  return (
    errors &&
    errors.some((error) => error.extensions?.code === UNAUTHENTICATED_CODE)
  );
};

const hasNetworkStatusCode = (
  error: NetworkError | undefined,
  code: number,
) => {
  return error && 'statusCode' in error && error.statusCode === code;
};

const uploadLink = createUploadLink({
  uri: config.GRAPHQL_API,
  headers: {
    'Apollo-Require-Preflight': 'ok', // This is for CSRF
  },
});
