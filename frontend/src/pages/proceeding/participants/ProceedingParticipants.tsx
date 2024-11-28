import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { AddIcon, EmailIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  Heading,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { useOutletContext } from 'react-router-dom';

import { PrimaryButton } from '@frontend/components/buttons';
import { Role, useAuth } from '@frontend/context/auth/auth-core';
import {
  GET_PROCEEDING_PARTICIPANTS,
  ParticipantsResponse,
} from '@frontend/gql/proceedings/queries.ts';
import { useCustomToast } from '@frontend/hooks/useCustomToast.ts';
import { OutletContextType } from '@frontend/pages/proceeding/overview/ProceedingOverviewPage';

import { SendEmailModal } from './components/sendEmail/SendEmailModal';

export const ProceedingParticipants = () => {
  const showToast = useCustomToast();
  const { role } = useAuth();
  const { proceeding } = useOutletContext<OutletContextType>();
  const [openSendEmailModal, setOpenSendEmailModal] = useState(false);

  const { data, loading, error } = useQuery<ParticipantsResponse>(
    GET_PROCEEDING_PARTICIPANTS,
    {
      variables: {
        proceedingId: Number(proceeding.id),
      },
    },
  );

  useEffect(() => {
    if (error) {
      showToast({
        title: 'Nepodařilo se načíst účastníky řízení',
        description:
          'Při načítání účastníků dědického řízení se vyskytla chyba.',
        status: 'error',
      });
    }
  }, [error, showToast]);

  return (
    <Box mt={2}>
      <Flex
        direction={{ base: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems={{ base: 'flex-start', md: 'center' }}
        mb={4}
      >
        <Heading size="md" mb={{ base: 2, md: 0 }}>
          Seznam účastníků
        </Heading>{' '}
        <Flex gap={4} direction={{ base: 'column', md: 'row' }}>
          {role === Role.NOTARY && (
            <PrimaryButton
              leftIcon={<EmailIcon />}
              onClick={() => setOpenSendEmailModal(true)}
            >
              Hromadná zpráva
            </PrimaryButton>
          )}
          {role === Role.NOTARY && (
            <PrimaryButton variant="outline" leftIcon={<AddIcon />}>
              Přidat účastníka
            </PrimaryButton>
          )}
        </Flex>
      </Flex>
      {loading && (
        <Flex justifyContent="center" mt={6}>
          <Spinner size="xl" color="goldenYellow.500" />
        </Flex>
      )}
      {data && data.proceedingParticipants.length === 0 && (
        <Flex justifyContent="center" mt={6} color="gray.500">
          <Text>Součástí dědického řízení nejsou žádní účastníci.</Text>
        </Flex>
      )}
      {data && data.proceedingParticipants.length > 0 && (
        <TableContainer
          maxW={{ base: '80vw', md: '100vw' }}
          borderWidth="1px"
          borderRadius="lg"
          mt={6}
        >
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Jméno</Th>
                <Th>Email</Th>
                <Th>Stav</Th>
                {role === Role.NOTARY && <Th>Akce</Th>}
              </Tr>
            </Thead>
            <Tbody>
              {data.proceedingParticipants.map((participant) => (
                <Tr
                  bg="white"
                  _hover={{ bg: 'goldenYellow.10' }}
                  key={participant.user.id}
                >
                  <Td>
                    {`${participant.user.beforeTitle ?? ''} ${participant.user.firstname} ${participant.user.lastname} ${participant.user.afterTitle ?? ''}`}
                  </Td>
                  <Td>{participant.user.email}</Td>
                  <Td>{participant.participantState.title}</Td>
                  {role === Role.NOTARY && (
                    <Td>
                      {/* TODO zobrazit akce Schválit/Zamítnout/Odstranit */}
                      <Button size="sm" mr={2} colorScheme="green">
                        Schválit
                      </Button>
                      <Button size="sm" colorScheme="red">
                        Zamítnout
                      </Button>
                    </Td>
                  )}
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      )}
      <SendEmailModal
        receivers={data?.proceedingParticipants}
        isOpen={openSendEmailModal}
        onClose={() => setOpenSendEmailModal(false)}
      />
    </Box>
  );
};
