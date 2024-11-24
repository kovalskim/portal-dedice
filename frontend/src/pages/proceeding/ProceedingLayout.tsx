import { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { Card, Flex, Spinner, Text } from '@chakra-ui/react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';

import {
  GET_PROCEEDING_BY_ID,
  ProceedingResponse,
} from '@frontend/gql/proceedings/queries.ts';
import { useCustomToast } from '@frontend/hooks/useCustomToast.ts';
import { Routes } from '@frontend/routes.ts';

import { Sidebar } from './components/sidebar/Sidebar';

export const ProceedingLayout = () => {
  const navigate = useNavigate();
  const showToast = useCustomToast();

  const { id } = useParams();
  const { loading, error, data } = useQuery<ProceedingResponse>(
    GET_PROCEEDING_BY_ID,
    {
      variables: {
        id: Number(id),
      },
      fetchPolicy: 'cache-first',
    },
  );

  useEffect(() => {
    if (error) {
      showToast({
        title: 'Nepodařilo se načíst dědické řízení.',
        description: '',
        status: 'error',
      });
      navigate(Routes.proceedings);
    }
  }, [error, showToast, navigate]);

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
              <Outlet context={{ proceeding: data.getProceeding }} />
            </Flex>
          </Card>
        </Flex>
      )}
    </>
  );
};
