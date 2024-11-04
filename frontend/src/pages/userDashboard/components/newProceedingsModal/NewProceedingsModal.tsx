import { FC } from 'react';
import { useMutation } from '@apollo/client';
import {
  Alert,
  AlertIcon,
  Flex,
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

  const [createProceedings, { loading, error }] =
    useMutation<CreateProceedingsResponse>(CREATE_PROCEEDING, {
      refetchQueries: [{ query: GET_ALL_PROCEEDINGS }],
    });

  const onSubmit = (data: DeceasedPersonFormFields) => {
    createProceedings({
      variables: {
        data: data,
      },
    }).then(() => {
      onClose();
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
          {error && (
            <Flex justifyContent="center">
              <Alert status="error" mb="8">
                <AlertIcon />
                Ups, něco se pokazilo. Zkuste to prosím znovu.
              </Alert>
            </Flex>
          )}
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
