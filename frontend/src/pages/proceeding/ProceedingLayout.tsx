import React from 'react';
import { useQuery } from '@apollo/client';
import { WarningIcon } from '@chakra-ui/icons';
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Box,
  Card,
  Flex,
  Icon,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';

import { theme } from '@frontend/components/design-system';
import {
  GET_PROCEEDING_BY_ID,
  ProceedingResponse,
} from '@frontend/gql/proceedings/queries.ts';
import { useCustomToast } from '@frontend/hooks/useCustomToast.ts';
import { Routes } from '@frontend/routes/routes.ts';

import { Sidebar } from './components/sidebar/Sidebar';

export const ProceedingLayout = () => {
  const navigate = useNavigate();
  const showToast = useCustomToast();

  const { id } = useParams();
  const { loading, data } = useQuery<ProceedingResponse>(GET_PROCEEDING_BY_ID, {
    variables: {
      id: Number(id),
    },
    fetchPolicy: 'cache-first',
    onError: () => {
      showToast({
        title: 'Nepodařilo se načíst dědické řízení.',
        description: 'Dědické řízení se nepodařilo načíst nebo neexistuje',
        status: 'error',
      });
      navigate(Routes.proceedings);
    },
  });

  if (loading) {
    return (
      <Flex width="full" justifyContent="center" gap={10}>
        <Spinner size="md" color="goldenYellow.500" />
        <Text color="goldenYellow.500">Načítání dědického řízení</Text>
      </Flex>
    );
  }

  return (
    <>
      {data && (
        <Flex
          height="full"
          direction={{ base: 'column', md: 'row' }}
          gap={{ base: 5, md: 10 }}
        >
          <Sidebar proceeding={data.getProceeding} />
          <Card w="100%" minHeight="full" flex="1">
            <Flex
              px={{ base: 2, md: 12 }}
              py={{ base: 2, md: 8 }}
              flex={1}
              flexDirection="column"
            >
              {data.getProceeding.notary?.isBanned && (
                <Alert
                  status="warning"
                  borderRadius={10}
                  cursor="pointer"
                  mb={4}
                >
                  <Icon
                    as={WarningIcon}
                    boxSize={5}
                    color={theme.colors.goldenYellow[700]}
                    mr={5}
                  />
                  <Box>
                    <AlertTitle>Blokace účtu notáře</AlertTitle>
                    <AlertDescription>
                      Účet notáře je v tuto chvíli zablokován, prosím
                      kontaktujte podporu aplikace.
                    </AlertDescription>
                  </Box>
                </Alert>
              )}
              <Outlet context={{ proceeding: data.getProceeding }} />
            </Flex>
          </Card>
        </Flex>
      )}
    </>
  );
};
