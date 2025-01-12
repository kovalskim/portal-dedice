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
import { useNavigate } from 'react-router-dom';

import { PrimaryButton, SecondaryButton } from '@frontend/components/buttons';
import { DELETE_BLOG_MUTATION } from '@frontend/gql/blog/mutations.ts';
import { useCustomToast } from '@frontend/hooks/useCustomToast.ts';
import { Routes } from '@frontend/routes/routes';

interface DeleteBlogModalProps {
  isOpen: boolean;
  onClose: () => void;
  blogId: number;
}

export const DeleteBlogModal: FC<DeleteBlogModalProps> = ({
  isOpen,
  onClose,
  blogId,
}) => {
  const showToast = useCustomToast();
  const navigate = useNavigate();

  const [deleteBlog, { loading }] = useMutation(DELETE_BLOG_MUTATION, {
    onError: () => {
      showToast({
        title: 'Nepodařilo se smazat článek',
        description: 'Při mazání článku došlo k chybě.',
        status: 'error',
      });
    },
    onCompleted: () => {
      showToast({
        title: 'Článek byl úspěšně smazán.',
        description: 'Článek byl úspěšně odstraněn z databáze.',
        status: 'success',
      });
      navigate(Routes.blog);
      onClose();
    },
  });

  const handleDelete = async () => {
    if (!blogId) return;

    await deleteBlog({ variables: { id: blogId } });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Potvrzení smazání článku</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>
            Opravdu chcete smazat tento článek? Tuto akci nelze vrátit zpět.
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
