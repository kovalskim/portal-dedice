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
} from '@chakra-ui/react';

import { PrimaryButton, SecondaryButton } from '@frontend/components';
import {
  DeceasedPersonForm,
  DeceasedPersonFormFields,
} from '@frontend/components/forms/deceasedPersonForm/DeceasedPersonForm.tsx';
import {
  UPDATE_PROCEEDING,
  UpdateProceedingsResponse,
} from '@frontend/gql/proceedings/mutations';
import { useCustomToast } from '@frontend/hooks/useCustomToast.ts';
import { useProceedings } from '@frontend/pages/userDashboard/hooks/useProceedings.ts';

interface EditProceedingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  proceedingId?: number;
  initialData?: DeceasedPersonFormFields;
}

export const EditProceedingsModal: FC<EditProceedingsModalProps> = ({
  isOpen,
  onClose,
  proceedingId,
  initialData,
}) => {
  const formId = 'edit-proceedings-form';
  const showToast = useCustomToast();

  const { refetch } = useProceedings();

  const [updateProceedings, { loading, error }] =
    useMutation<UpdateProceedingsResponse>(UPDATE_PROCEEDING, {
      fetchPolicy: 'network-only',
    });

  useEffect(() => {
    if (error && isOpen) {
      showToast({
        title: 'Aktualizace dědického řízení se nezdařila',
        description: 'Při aktualizaci dědického řízení došlo k problémům.',
        status: 'error',
      });
    }
  }, [error, showToast, isOpen]);

  const onSubmit = (data: DeceasedPersonFormFields) => {
    updateProceedings({
      variables: {
        id: Number(proceedingId),
        data: data,
      },
    }).then(() => {
      onClose();
      showToast({
        title: 'Aktualizace dědického řízení proběhla úspěšně.',
        description: `Dědické řízení bylo úspěšně aktualizováno!`,
        status: 'success',
      });
      refetch();
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
