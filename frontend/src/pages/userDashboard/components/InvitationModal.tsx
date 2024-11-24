import { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import { useLocation, useNavigate } from 'react-router-dom';

import { PrimaryButton, SecondaryButton } from '@frontend/components/buttons';
import { ACCEPT_INVITATION_MUTATION } from '@frontend/gql/proceedings/mutations.ts';
import { useCustomToast } from '@frontend/hooks/useCustomToast.ts';
import { Routes } from '@frontend/routes/routes.ts';

export const InvitationModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [acceptInvitation, { loading, error }] = useMutation(
    ACCEPT_INVITATION_MUTATION,
  );
  const [hasProcessedError, setHasProcessedError] = useState(false);
  const showToast = useCustomToast();

  const searchParams = new URLSearchParams(location.search);
  const invitationToken = searchParams.get('invitation_token');

  useEffect(() => {
    if (invitationToken) {
      setIsOpen(true);
    }
  }, [invitationToken]);

  useEffect(() => {
    if (!error || hasProcessedError) return;
    if (error.message.includes('expired')) {
      showToast({
        title: 'Odkaz k přijetí účasti expiroval.',
        description: 'Požádejte o nový odkaz notáře.',
        status: 'error',
      });
    } else {
      showToast({
        title: 'Neplatný odkaz',
        description: 'Zadejte prosím platný odkaz.',
        status: 'error',
      });
    }
    setHasProcessedError(true);
    navigate(Routes.proceedings);
  }, [error, hasProcessedError, navigate, showToast]);

  const handleAccept = async () => {
    try {
      await acceptInvitation({ variables: { token: invitationToken } });
      showToast({
        title: 'Úspěšně jste přijal(a) účast.',
        description: 'Nyní jste členem dědického řízení.',
        status: 'success',
      });
    } catch (err) {
      console.error('Error accepting invitation:', err);
    }
    setIsOpen(false);
    navigate(Routes.proceedings);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Pozvánka k účasti v dědickém řízení</ModalHeader>
        <ModalBody>
          <Text>Chcete se stát účastníkem dědického řízení?</Text>
        </ModalBody>
        <ModalFooter justifyContent="space-between">
          <SecondaryButton onClick={handleClose}>Zavřít</SecondaryButton>
          <PrimaryButton onClick={handleAccept} isLoading={loading}>
            Přijmout pozvánku
          </PrimaryButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
