import { FC } from 'react';
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

import { GeneralInfoForm, GeneralInfoFormFields } from './GeneralInfoForm';

interface NewProceedingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewProceedingsModal: FC<NewProceedingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const formId = 'create-proceedings-form';

  const onSubmit = (data: GeneralInfoFormFields) => {
    console.log(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Nové dědické řízení</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <GeneralInfoForm id={formId} onSubmit={(data) => onSubmit(data)} />
        </ModalBody>
        <ModalFooter justifyContent="space-between">
          <SecondaryButton onClick={onClose}>Zrušit</SecondaryButton>
          <PrimaryButton type="submit" form={formId}>
            Založit řízení
          </PrimaryButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
