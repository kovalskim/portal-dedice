import { useQuery } from '@apollo/client';
import { Box } from '@chakra-ui/react';

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
    <Box p="8">
      <Box>
        {`Hello: ${user ? `${user.firstname} ${user.lastname}` : '(not logged in)'}`}
      </Box>
      <Box pt="4">GraphQL query result:</Box>
      <Box>{JSON.stringify(queryState.data)}</Box>
    </Box>
  );
};
