import { FC, useEffect } from 'react';
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
import { DELETE_FILE_MUTATION } from '@frontend/gql/file/mutations.ts';
import { useCustomToast } from '@frontend/hooks/useCustomToast.ts';

interface DeleteFileModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileId?: number;
  onDelete: () => void;
}

export const DeleteFileModal: FC<DeleteFileModalProps> = ({
  isOpen,
  onClose,
  fileId,
  onDelete,
}) => {
  const showToast = useCustomToast();

  const [deleteFile, { loading, error }] = useMutation(DELETE_FILE_MUTATION);

  useEffect(() => {
    if (error && isOpen) {
      showToast({
        title: 'Nepodařilo se smazat soubor',
        description: 'Při mazání souboru dědického řízení se vyskytla chyba.',
        status: 'error',
      });
    }
  }, [error, showToast, isOpen]);

  const handleDelete = async () => {
    await deleteFile({ variables: { id: fileId } });

    showToast({
      title: 'Soubor byl úspěšně smazán.',
      description: 'Soubor z dědického řízení byl úspěšně smazán.',
      status: 'success',
    });
    onDelete();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Potvrzení smazání souboru</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>
            Opravdu chcete smazat tento soubor? Tuto akci nelze vrátit zpět.
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
