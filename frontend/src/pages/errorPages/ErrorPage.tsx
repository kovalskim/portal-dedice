import { Box, Text } from '@chakra-ui/react';
import { useRouteError } from 'react-router-dom';

import { Routes } from '@frontend/routes/routes.ts';

import { RouterLink } from '../../components/navigation/atoms';

export const ErrorPage = () => {
  let error = useRouteError();
  console.error(error);

  return (
    <Box p="8">
      <Box>
        <Text>Ups, něco se pokazilo</Text>{' '}
        <RouterLink to={Routes.home}>Domů</RouterLink>
      </Box>
    </Box>
  );
};
