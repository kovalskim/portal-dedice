import { useMutation } from '@apollo/client';
import { Box } from '@chakra-ui/layout';
import {
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
} from '@chakra-ui/react';

import { PrimaryButton, SecondaryButton } from '@frontend/components/buttons';
import { INVITE_USER } from '@frontend/gql/user/mutations.ts';
import { useCustomToast } from '@frontend/hooks/useCustomToast.ts';
import {
  UserInvitationForm,
  UserInvitationFormFields,
} from '@frontend/pages/users/components/UserInvitationForm.tsx';

type InviteUserModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const InviteUserModal = ({ isOpen, onClose }: InviteUserModalProps) => {
  const showToast = useCustomToast();

  const [inviteUser, { loading }] = useMutation(INVITE_USER, {
    onError: (error) => {
      if (error?.graphQLErrors[0]?.extensions?.code === 'ALREADY_EXISTING') {
        showToast({
          title: 'Pozvání uživatele do portálu se nezdařilo',
          description: 'Uživatel se zadanou emailovou adresou již existuje.',
          status: 'error',
        });
      } else if (error?.graphQLErrors[0].extensions?.code === 'NOT_SUPPORTED') {
        showToast({
          title: 'Pozvání uživatele do portálu se nezdařilo',
          description: 'Zadejte existujícího notáře daného soudu..',
          status: 'error',
        });
      } else {
        showToast({
          title: 'Pozvání uživatele do portálu se nezdařilo',
          description: 'Při odesílání pozvánky uživateli došlo k problémům.',
          status: 'error',
        });
      }
    },
    onCompleted: () => {
      showToast({
        title: 'Pozvání uživatele do portálu proběhlo úspěšně.',
        description: `Novému uživateli portálu byla odeslána pozvánka.`,
        status: 'success',
      });
      onClose();
    },
  });

  const handleSubmit = async (data: UserInvitationFormFields) => {
    await inviteUser({
      variables: {
        data: {
          firstname: data.firstname,
          lastname: data.lastname,
          email: data.email,
          role: data.role,
          criteria: {
            court: data.court || null,
            lastnameLetters: data.lastnameLetters,
            birthDaysMonths: data.birthDaysMonths,
            deathDaysMonths: data.deathDaysMonths,
            rules: data.rules,
          },
        },
      },
    });
  };

  return (
    <Modal
      closeOnOverlayClick={false}
      isOpen={isOpen}
      onClose={onClose}
      size="3xl"
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Přidat nového uživatele</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex
            justifyContent="center"
            alignItems="center"
            direction="column"
            display={loading ? 'flex' : 'none'}
          >
            <Spinner size="xl" color="goldenYellow.500"></Spinner>
            <Text size="lg" my={4}>
              Probíhá odesílání pozvánky uživateli
            </Text>
          </Flex>
          <Box display={!loading ? 'block' : 'none'}>
            <UserInvitationForm id="invite-user" onSubmit={handleSubmit} />
          </Box>
        </ModalBody>
        <ModalFooter justifyContent="space-between">
          <SecondaryButton onClick={onClose} isDisabled={loading}>
            Zrušit
          </SecondaryButton>
          <PrimaryButton type="submit" form="invite-user">
            Odeslat pozvánku
          </PrimaryButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
