import { useQuery } from '@apollo/client';
import { Box } from '@chakra-ui/react';

import { MainLayout } from '@frontend/components';
import { useAuth } from '@frontend/context/auth';
import { gql } from '@frontend/gql';

const EMPTY_QUERY = gql(/* GraphQL */ `
  query Quacks {
    _empty
  }
`);

export const HomePage = () => {
  const { user } = useAuth();
  const queryState = useQuery(EMPTY_QUERY);

  return (
    <MainLayout>
      <Box p="8">
        <Box>Hello: {user ? user.name : '(not logged in)'}</Box>
        <Box pt="4">GraphQL query result:</Box>
        <Box as="pre" fontFamily="mono">
          {JSON.stringify(queryState.data)}
        </Box>
      </Box>
    </MainLayout>
  );
};
