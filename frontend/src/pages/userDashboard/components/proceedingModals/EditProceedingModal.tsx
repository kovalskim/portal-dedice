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
} from '@chakra-ui/react';

import { PrimaryButton, SecondaryButton } from '@frontend/components/buttons';
import {
  DeceasedPersonForm,
  DeceasedPersonFormFields,
} from '@frontend/components/forms/deceasedPersonForm/DeceasedPersonForm.tsx';
import {
  UPDATE_PROCEEDING,
  UpdateProceedingResponse,
} from '@frontend/gql/proceedings/mutations';
import { GET_ALL_PROCEEDINGS } from '@frontend/gql/proceedings/queries.ts';
import { useCustomToast } from '@frontend/hooks/useCustomToast.ts';

interface EditProceedingModalProps {
  isOpen: boolean;
  onClose: () => void;
  proceedingId?: number;
  initialData?: DeceasedPersonFormFields;
}

export const EditProceedingModal: FC<EditProceedingModalProps> = ({
  isOpen,
  onClose,
  proceedingId,
  initialData,
}) => {
  const formId = 'edit-proceedings-form';
  const showToast = useCustomToast();

  const [updateProceeding, { loading }] = useMutation<UpdateProceedingResponse>(
    UPDATE_PROCEEDING,
    {
      onError: () => {
        showToast({
          title: 'Aktualizace dědického řízení se nezdařila',
          description: 'Při aktualizaci dědického řízení došlo k problémům.',
          status: 'error',
        });
      },
      onCompleted: () => {
        onClose();
        showToast({
          title: 'Aktualizace dědického řízení proběhla úspěšně.',
          description: `Dědické řízení bylo úspěšně aktualizováno!`,
          status: 'success',
        });
      },
      refetchQueries: [GET_ALL_PROCEEDINGS],
    },
  );

  const onSubmit = async (data: DeceasedPersonFormFields) => {
    await updateProceeding({
      variables: {
        id: Number(proceedingId),
        data: data,
      },
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Upravit dědické řízení</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <DeceasedPersonForm
            id={formId}
            onSubmit={(data) => onSubmit(data)}
            loadDefaultFrom={initialData}
          />
        </ModalBody>
        <ModalFooter justifyContent="space-between">
          <SecondaryButton onClick={onClose} disabled={loading}>
            Zrušit
          </SecondaryButton>
          <PrimaryButton type="submit" form={formId} isLoading={loading}>
            Uložit změny
          </PrimaryButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
