import { FC } from 'react';
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
import {
  DELETE_PROCEEDING,
  DeleteProceedingResponse,
} from '@frontend/gql/proceedings/mutations';
import { GET_ALL_PROCEEDINGS } from '@frontend/gql/proceedings/queries';
import { useCustomToast } from '@frontend/hooks/useCustomToast.ts';

interface DeleteProceedingModalProps {
  isOpen: boolean;
  onClose: () => void;
  proceedingId?: number;
}

export const DeleteProceedingModal: FC<DeleteProceedingModalProps> = ({
  isOpen,
  onClose,
  proceedingId,
}) => {
  const showToast = useCustomToast();

  const [deleteProceeding, { loading }] = useMutation<DeleteProceedingResponse>(
    DELETE_PROCEEDING,
    {
      onError: () => {
        showToast({
          title: 'Smazání dědického řízení se nezdařilo',
          description: 'Při mazání dědického řízení došlo k problémům.',
          status: 'error',
        });
      },
      onCompleted: () => {
        showToast({
          title: 'Dědické řízení bylo úspěšně smazáno.',
          description: 'Řízení bylo odstraněno.',
          status: 'success',
        });
        onClose();
      },
      refetchQueries: [GET_ALL_PROCEEDINGS],
    },
  );

  const handleDelete = async () => {
    await deleteProceeding({
      variables: { id: Number(proceedingId) },
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Potvrzení smazání řízení</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>
            Opravdu chcete smazat toto dědické řízení? Tuto akci nelze vrátit
            zpět.
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
