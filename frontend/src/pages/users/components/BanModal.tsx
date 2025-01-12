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
import { SET_USER_BAN_STATUS } from '@frontend/gql/user/mutations.ts';
import { GET_ALL_USERS } from '@frontend/gql/user/queries.ts';
import { useCustomToast } from '@frontend/hooks/useCustomToast.ts';

interface BanModalProps {
  banModalOpenState: 'close' | 'ban' | 'unban';
  onClose: () => void;
  userId?: number;
}

export const BanModal: FC<BanModalProps> = ({
  banModalOpenState,
  onClose,
  userId,
}) => {
  const showToast = useCustomToast();

  const [setUserBanStatus, { loading }] = useMutation(SET_USER_BAN_STATUS, {
    onError: () => {
      showToast({
        title: 'Nepodařilo se změnit stav uživatele',
        description: 'Při blokování uživatele došlo k chybě.',
        status: 'error',
      });
    },
    onCompleted: () => {
      if (banModalOpenState === 'ban') {
        showToast({
          title: 'Uživatel byl úspěšně zablokován.',
          description:
            'Uživatel byl zablokován a již se nemůže přihlásit do aplikace.',
          status: 'success',
        });
      } else if (banModalOpenState === 'unban') {
        showToast({
          title: 'Uživatel byl úspěšně odblokován.',
          description:
            'Uživatel byl odblokován a již se opět může přihlásit do aplikace.',
          status: 'success',
        });
      }
      onClose();
    },
    refetchQueries: [GET_ALL_USERS],
  });

  const handleSetUserBanStatus = async () => {
    await setUserBanStatus({
      variables: {
        userId: userId,
        isBanned: banModalOpenState === 'ban',
      },
    });
  };

  const isOpen = banModalOpenState === 'ban' || banModalOpenState === 'unban';

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {banModalOpenState === 'ban'
            ? 'Potvrzení zablokování uživatele'
            : 'Potvrzení odblokování uživatele'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>
            {banModalOpenState === 'ban'
              ? 'Opravdu chcete zablokovat tohoto uživatele? Uživatel se již nebude moc přihlásit do aplikace.'
              : 'Opravdu chcete odblokovat tohoto uživatele? Uživatel se bude opět moc přihlásit do aplikace.'}
          </Text>
        </ModalBody>
        <ModalFooter justifyContent="space-between">
          <SecondaryButton onClick={onClose} disabled={loading}>
            Zrušit
          </SecondaryButton>
          <PrimaryButton
            colorScheme={banModalOpenState === 'ban' ? 'red' : 'green'}
            onClick={handleSetUserBanStatus}
            isLoading={loading}
          >
            {banModalOpenState === 'ban' ? 'Zablokovat' : 'Odblokovat'}
          </PrimaryButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
