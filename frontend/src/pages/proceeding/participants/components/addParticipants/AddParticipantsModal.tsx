import { useEffect } from 'react';
import { useMutation } from '@apollo/client';
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
import { INVITE_PARTICIPANTS_TO_PROCEEDING } from '@frontend/gql/proceedings/mutations.ts';
import { useCustomToast } from '@frontend/hooks/useCustomToast.ts';
import {
  AddParticipantsForm,
  ParticipantFormFields,
} from '@frontend/pages/proceeding/participants/components/addParticipants/AddParticipantsForm.tsx';

type AddParticipantsModalProps = {
  proceedingId: number;
  isOpen: boolean;
  onClose: () => void;
};

export const AddParticipantsModal = ({
  proceedingId,
  isOpen,
  onClose,
}: AddParticipantsModalProps) => {
  const showToast = useCustomToast();

  const [addParticipantsToProceeding, { loading, error }] = useMutation(
    INVITE_PARTICIPANTS_TO_PROCEEDING,
  );

  useEffect(() => {
    if (error && isOpen) {
      showToast({
        title: 'Pozvání účastníků řízení se nezdařilo',
        description:
          'Při odesílání pozvánek účastníkům řízení došlo k problémům.',
        status: 'error',
      });
    }
  }, [error, showToast, isOpen]);

  const handleSubmit = async (data: {
    participants: ParticipantFormFields[];
  }) => {
    await addParticipantsToProceeding({
      variables: {
        data: {
          proceedingId: Number(proceedingId),
          participants: data.participants,
        },
      },
    }).then(() => {
      showToast({
        title: 'Pozvání účastníků řízení proběhlo úspěšně.',
        description: `Zvoleným účastníkům řízení byly odeslány pozvánky.`,
        status: 'success',
      });
      onClose();
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Přidat účastníky řízení</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {loading && (
            <Flex
              justifyContent="center"
              alignItems="center"
              direction="column"
            >
              <Spinner size="xl" color="goldenYellow.500"></Spinner>
              <Text size="lg" my={4}>
                Probíhá odesílání pozvánek účastníkům řízení
              </Text>
            </Flex>
          )}
          {!loading && (
            <AddParticipantsForm
              id="add-participants"
              onSubmit={handleSubmit}
            />
          )}
        </ModalBody>
        <ModalFooter justifyContent="space-between">
          <SecondaryButton onClick={onClose} isDisabled={loading}>
            Zrušit
          </SecondaryButton>
          <PrimaryButton
            type="submit"
            form="add-participants"
            isDisabled={loading}
          >
            Odeslat pozvánky
          </PrimaryButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
