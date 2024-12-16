import { FC } from 'react';
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
import { DeceasedPersonFormFields } from '@frontend/components/forms/deceasedPersonForm/DeceasedPersonForm.tsx';
import {
  CREATE_PROCEEDING,
  CreateProceedingResponse,
} from '@frontend/gql/proceedings/mutations';
import { GET_ALL_PROCEEDINGS } from '@frontend/gql/proceedings/queries.ts';
import { useCustomToast } from '@frontend/hooks/useCustomToast.ts';
import { ParticipantFormFields } from '@frontend/pages/proceeding/participants/components/addParticipants/AddParticipantsForm.tsx';
import {
  NewProceedingForm,
  NewProceedingFormFields,
} from '@frontend/pages/userDashboard/components/proceedingModals/NewProceedingForm';
import { useNewProceedingFormStore } from '@frontend/pages/userDashboard/hooks/useNewProceedingFormStore.ts';

interface NewProceedingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewProceedingModal: FC<NewProceedingModalProps> = ({
  isOpen,
  onClose,
}) => {
  const showToast = useCustomToast();

  const { step, setStep, formData, setFormData } = useNewProceedingFormStore();

  const [createProceeding, { loading }] = useMutation<CreateProceedingResponse>(
    CREATE_PROCEEDING,
    {
      onError: () => {
        showToast({
          title: 'Založení nového dědického řízení se nezdařilo',
          description: 'Při vytváření dědického řízení došlo k problémům.',
          status: 'error',
        });
      },
      onCompleted: () => {
        showToast({
          title: 'Založení nového dědického řízení proběhlo úspěšně.',
          description: `Bylo vytvořeno nové dědické řízení!`,
          status: 'success',
        });
        onClose();
      },
      refetchQueries: [GET_ALL_PROCEEDINGS],
    },
  );

  const onSubmit = async (data: NewProceedingFormFields) => {
    await createProceeding({
      variables: {
        data: data,
      },
    });
  };

  const handleSubmitStep1 = (data: DeceasedPersonFormFields) => {
    setFormData({ deceasedPersonInfo: data });
    setStep(2);
  };

  const handleSubmitStep2 = async (data: ParticipantFormFields) => {
    const updatedFormData = { ...formData, narratorContactInfo: data };
    setFormData({ ...updatedFormData });

    await onSubmit(updatedFormData as Required<typeof updatedFormData>);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Nové dědické řízení</ModalHeader>
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
                Probíhá vytváření dědického řízení
              </Text>
            </Flex>
          )}
          {!loading && (
            <NewProceedingForm
              onSubmitStep1={handleSubmitStep1}
              onSubmitStep2={handleSubmitStep2}
              onClose={onClose}
            />
          )}
        </ModalBody>
        <ModalFooter justifyContent="space-between">
          {step === 1 && (
            <>
              <SecondaryButton onClick={onClose} isDisabled={loading}>
                Zrušit
              </SecondaryButton>
              <PrimaryButton
                type="submit"
                form="deceasedPersonInfo"
                variant="outline"
              >
                Krok 2: Přidat vypravitele
              </PrimaryButton>
            </>
          )}
          {step === 2 && (
            <>
              <SecondaryButton onClick={() => setStep(1)} isDisabled={loading}>
                Zpět
              </SecondaryButton>
              <PrimaryButton
                type="submit"
                form="narratorInfo"
                isDisabled={loading}
              >
                Vytvořit řízení
              </PrimaryButton>
            </>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
