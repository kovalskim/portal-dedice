import { useMutation } from '@apollo/client';
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';

import { PrimaryButton, SecondaryButton } from '@frontend/components/buttons';
import { DELETE_PARTICIPANT } from '@frontend/gql/proceedings/mutations.ts';
import { GET_PROCEEDING_PARTICIPANTS } from '@frontend/gql/proceedings/queries.ts';
import { useCustomToast } from '@frontend/hooks/useCustomToast.ts';

type DeleteProceedingModalProps = {
  isOpen: boolean;
  onClose: () => void;
  proceedingId: number;
  participantId: number;
};

export const DeleteParticipantModal = ({
  isOpen,
  onClose,
  proceedingId,
  participantId,
}: DeleteProceedingModalProps) => {
  const showToast = useCustomToast();

  const [deleteParticipant, { loading }] = useMutation(DELETE_PARTICIPANT, {
    refetchQueries: [
      {
        query: GET_PROCEEDING_PARTICIPANTS,
        variables: {
          proceedingId: Number(proceedingId),
        },
      },
    ],
    fetchPolicy: 'network-only',
  });

  const handleDelete = () => {
    deleteParticipant({
      variables: {
        data: {
          proceedingId: Number(proceedingId),
          participantId: Number(participantId),
        },
      },
    })
      .then(() => {
        showToast({
          title: 'Odstranění účastníka řízení proběhlo úspěšně.',
          description: `Účastník řízení byl odstraněn!`,
          status: 'success',
        });
        onClose();
      })
      .catch(() => {
        showToast({
          title: 'Odstranění účastníka řízení proběhlo neúspěšně.',
          description: `Účastník řízení nebyl odstraněn!`,
          status: 'error',
        });
      });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Potvrzení odebrání účastníka řízení</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>
            Opravdu chcete odebrat vybraného účastníka řízení? Tuto akci nelze
            vrátit zpět.
          </Text>
        </ModalBody>
        <ModalFooter justifyContent="space-between">
          <SecondaryButton onClick={onClose} disabled={loading}>
            Zrušit
          </SecondaryButton>
          <PrimaryButton
            colorScheme="red"
            onClick={handleDelete}
            isLoading={loading}
          >
            Smazat
          </PrimaryButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
