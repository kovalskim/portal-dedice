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
  CREATE_PROCEEDING,
  CreateProceedingsResponse,
} from '@frontend/gql/proceedings/mutations';
import { GET_ALL_PROCEEDINGS } from '@frontend/gql/proceedings/queries';
import { useCustomToast } from '@frontend/hooks/useCustomToast.ts';
import {
  DeceasedPersonForm,
  DeceasedPersonFormFields,
} from '@frontend/pages/educator/components/notary-identification/DeceasedPersonForm';

interface NewProceedingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewProceedingsModal: FC<NewProceedingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const formId = 'create-proceedings-form';
  const showToast = useCustomToast();

  const [createProceedings, { loading, error }] =
    useMutation<CreateProceedingsResponse>(CREATE_PROCEEDING, {
      refetchQueries: [{ query: GET_ALL_PROCEEDINGS }],
    });

  useEffect(() => {
    if (error && isOpen) {
      showToast({
        title: 'Založení nového dědického řízení se nezdařilo',
        description: 'Při vytváření dědického řízení došlo k problémům.',
        status: 'error',
      });
    }
  }, [error, showToast, isOpen]);

  const onSubmit = (data: DeceasedPersonFormFields) => {
    createProceedings({
      variables: {
        data: data,
      },
    }).then(() => {
      onClose();
      showToast({
        title: 'Založení nového dědického řízení proběhlo úspěšně.',
        description: `Bylo vytvořeno nové dědické řízení!`,
        status: 'success',
      });
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Nové dědické řízení</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <DeceasedPersonForm id={formId} onSubmit={(data) => onSubmit(data)} />
        </ModalBody>
        <ModalFooter justifyContent="space-between">
          <SecondaryButton onClick={onClose} disabled={loading}>
            Zrušit
          </SecondaryButton>
          <PrimaryButton type="submit" form={formId} isLoading={loading}>
            Založit řízení
          </PrimaryButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
