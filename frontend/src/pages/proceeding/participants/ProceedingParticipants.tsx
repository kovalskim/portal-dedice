import { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import {
  AddIcon,
  CheckIcon,
  CloseIcon,
  EmailIcon,
  NotAllowedIcon,
} from '@chakra-ui/icons';
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
import { PARTICIPANT_STATES } from '@frontend/constants.ts';
import { Role, useAuth } from '@frontend/context/auth/auth-core';
import {
  APPROVE_PARTICIPANT,
  REJECT_PARTICIPANT,
} from '@frontend/gql/proceedings/mutations.ts';
import {
  GET_PROCEEDING_PARTICIPANTS,
  ParticipantsResponse,
} from '@frontend/gql/proceedings/queries.ts';
import { useCustomToast } from '@frontend/hooks/useCustomToast.ts';
import { OutletContextType } from '@frontend/pages/proceeding/overview/ProceedingOverviewPage.tsx';
import { AddParticipantsModal } from '@frontend/pages/proceeding/participants/components/addParticipants/AddParticipantsModal.tsx';
import { DeleteParticipantModal } from '@frontend/pages/proceeding/participants/components/DeleteParticipantModal.tsx';

import { SendEmailModal } from './components/sendEmail/SendEmailModal';

export const ProceedingParticipants = () => {
  const showToast = useCustomToast();
  const { role } = useAuth();
  const { proceeding } = useOutletContext<OutletContextType>();
  const [openSendEmailModal, setOpenSendEmailModal] = useState(false);
  const [openAddParticipantsModal, setOpenAddParticipantsModal] =
    useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState<{
    id: number;
  } | null>(null);
  const [deleteParticipantModalOpen, setDeleteParticipantModalOpen] =
    useState(false);

  const { data, loading, error, refetch } = useQuery<ParticipantsResponse>(
    GET_PROCEEDING_PARTICIPANTS,
    {
      variables: {
        proceedingId: Number(proceeding.id),
      },
    },
  );

  const [approveParticipant] = useMutation(APPROVE_PARTICIPANT);

  const [rejectParticipant] = useMutation(REJECT_PARTICIPANT);

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

  const handleApproveParticipant = (participantId: number) => {
    approveParticipant({
      variables: {
        data: {
          proceedingId: Number(proceeding.id),
          participantId: Number(participantId),
        },
      },
    })
      .then(() => {
        showToast({
          title: 'Schválení účastníka řízení proběhlo úspěšně.',
          description: `Žádost uživatele o účast v dědickém řízení byla schválena!`,
          status: 'success',
        });
        refetch();
      })
      .catch(() => {
        showToast({
          title: 'Schválení účastníka řízení proběhlo neúspěšně.',
          description: `Žádost uživatele o účast v dědickém řízení nebyla schválena!`,
          status: 'error',
        });
      });
  };

  const handleRejectParticipant = (id: number) => {
    rejectParticipant({
      variables: {
        data: {
          proceedingId: Number(proceeding.id),
          participantId: Number(id),
        },
      },
    })
      .then(() => {
        showToast({
          title: 'Zamítnutí účastníka řízení proběhlo úspěšně.',
          description: `Žádost uživatele o účast v dědickém řízení byla zamítnuta!`,
          status: 'success',
        });
        refetch();
      })
      .catch(() => {
        showToast({
          title: 'Zamítnutí účastníka řízení proběhlo neúspěšně.',
          description: `Žádost uživatele o účast v dědickém řízení nebyla zamítnuta!`,
          status: 'error',
        });
      });
  };

  const handleDeleteParticipant = (id: number) => {
    setDeleteParticipantModalOpen(true);
    setSelectedParticipant({ id });
  };

  return (
    <Box mt={2}>
      <Flex
        direction={{ base: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems={{ base: 'flex-start', md: 'center' }}
        mb={4}
      >
        <Heading size="md" mb={{ base: 2, md: 0 }}>
          Seznam účastníků řízení
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
            <PrimaryButton
              variant="outline"
              leftIcon={<AddIcon />}
              onClick={() => setOpenAddParticipantsModal(true)}
            >
              Přidat účastníky
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
                      {participant.participantState.id ===
                      PARTICIPANT_STATES.WAITING_FOR_APPROVAL ? (
                        <>
                          <Button
                            size="sm"
                            mr={2}
                            colorScheme="green"
                            onClick={() =>
                              handleApproveParticipant(
                                participant.participantId,
                              )
                            }
                          >
                            <CheckIcon mr={2} />
                            Schválit
                          </Button>
                          <Button
                            size="sm"
                            colorScheme="red"
                            onClick={() =>
                              handleRejectParticipant(participant.participantId)
                            }
                          >
                            <NotAllowedIcon mr={2} />
                            Zamítnout
                          </Button>
                        </>
                      ) : (
                        <Button
                          size="sm"
                          mr={2}
                          colorScheme="red"
                          variant="outline"
                          onClick={() =>
                            handleDeleteParticipant(participant.participantId)
                          }
                        >
                          <CloseIcon fontSize="xs" mr={2} />
                          Odebrat účastníka
                        </Button>
                      )}
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

      <AddParticipantsModal
        proceedingId={proceeding.id}
        isOpen={openAddParticipantsModal}
        onClose={() => setOpenAddParticipantsModal(false)}
      />

      {selectedParticipant !== null && (
        <DeleteParticipantModal
          isOpen={deleteParticipantModalOpen}
          proceedingId={proceeding.id}
          participantId={selectedParticipant.id}
          onClose={() => setDeleteParticipantModalOpen(false)}
        />
      )}
    </Box>
  );
};
