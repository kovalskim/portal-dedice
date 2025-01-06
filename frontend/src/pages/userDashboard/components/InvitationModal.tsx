import { useEffect, useRef, useState } from 'react';
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
import {
  ACCEPT_INVITATION_MUTATION,
  VERIFY_PARTICIPANT_INVITATION_TOKEN,
} from '@frontend/gql/proceedings/mutations.ts';
import { useCustomToast } from '@frontend/hooks/useCustomToast.ts';
import { Routes } from '@frontend/routes/routes.ts';

export const InvitationModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const showToast = useCustomToast();

  const searchParams = new URLSearchParams(location.search);
  const invitationToken = searchParams.get('invitation_token');

  const hasVerified = useRef(false);

  const [verifyInvitationToken] = useMutation(
    VERIFY_PARTICIPANT_INVITATION_TOKEN,
    {
      onError: () => {
        showToast({
          title: 'Odkaz s pozvánkou k dědickému řízení je neplatný.',
          description: 'Požádejte o nový odkaz notáře.',
          status: 'error',
        });
        setIsOpen(false);
        navigate(Routes.proceedings);
      },
      onCompleted: () => {
        setIsOpen(true);
      },
    },
  );

  const [acceptInvitation, { loading }] = useMutation(
    ACCEPT_INVITATION_MUTATION,
    {
      onError: () => {
        showToast({
          title: 'Při přijmutí pozvánky k dědickému řízení nastala chyba.',
          description: 'Využijte prosím platnou pozvánku k dědickému řízení.',
          status: 'error',
        });
        setIsOpen(false);
        navigate(Routes.proceedings);
      },
      onCompleted: () => {
        showToast({
          title: 'Úspěšně jste přijal(a) pozvánku.',
          description: 'Vyčkejte na schválení vaší účasti v dědickém řízení.',
          status: 'success',
        });
        setIsOpen(false);
        navigate(Routes.proceedings);
      },
    },
  );

  useEffect(() => {
    (async () => {
      if (invitationToken && !hasVerified.current) {
        hasVerified.current = true;
        await verifyInvitationToken({ variables: { token: invitationToken } });
      }
    })();
  }, [invitationToken, hasVerified, verifyInvitationToken]);

  const handleAccept = async () => {
    await acceptInvitation({ variables: { token: invitationToken } });
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Pozvánka k účasti v dědickém řízení</ModalHeader>
        {!loading && (
          <>
            <ModalBody>
              <Text>Chcete se stát účastníkem dědického řízení?</Text>
            </ModalBody>
            <ModalFooter justifyContent="space-between">
              <SecondaryButton onClick={handleClose}>Zavřít</SecondaryButton>
              <PrimaryButton onClick={handleAccept} isLoading={loading}>
                Přijmout pozvánku
              </PrimaryButton>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
