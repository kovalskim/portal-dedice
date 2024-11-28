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
  SystemStyleObject,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';

import { PrimaryButton } from '@frontend/components/buttons';
import { FancySelectField } from '@frontend/components/forms/fields/FancySelectField';
import { InputField } from '@frontend/components/forms/fields/InputField';
import { TextareaField } from '@frontend/components/forms/fields/TextareaField';
import { Form } from '@frontend/components/forms/Form';
import { useAuth } from '@frontend/context/auth/auth-core';
import { SEND_MESSAGE_TO_PARTICIPANTS } from '@frontend/gql/proceedings/mutations';
import { Participant } from '@frontend/gql/proceedings/queries';
import { useCustomToast } from '@frontend/hooks/useCustomToast';

const baseSendEmailSchema = zod.object({
  title: zod
    .string()
    .min(1, { message: 'Povinné pole' })
    .max(100, 'Přesáhl jste maximální povolenou délku'),
  message: zod
    .string()
    .min(1, { message: 'Povinné pole' })
    .max(2000, 'Přesáhl jste maximální povolenou délku'),
  receivers: zod.array(
    zod.object({ label: zod.string(), value: zod.string() }),
  ),
});

type SendEmailFields = zod.infer<typeof baseSendEmailSchema>;

type SendEmailModalProps = {
  receivers?: Participant[];
  isOpen: boolean;
  onClose: () => void;
};

export const SendEmailModal = ({
  receivers,
  isOpen,
  onClose,
}: SendEmailModalProps) => {
  const { user } = useAuth();
  const showToast = useCustomToast();
  const [sendMessageToParticipants, { loading, error }] = useMutation<void>(
    SEND_MESSAGE_TO_PARTICIPANTS,
  );

  const onSubmit = (data: SendEmailFields) => {
    const proceedingId =
      receivers && receivers?.length > 0
        ? receivers[0].proceedingId
        : undefined;

    const receiversEmails =
      data.receivers.length > 0
        ? data.receivers.map((val) => val.value)
        : receivers
            ?.filter((val) => val.user.email !== user?.email)
            .map((val) => val.user.email);

    if (!receiversEmails || receiversEmails.length === 0) {
      showToast({
        title: 'Chybí příjemci zprávy',
        description: 'Je potreba mít alespoň jednoho příjemce zprávy.',
        status: 'error',
      });
      return;
    }

    sendMessageToParticipants({
      variables: {
        data: {
          ...data,
          receivers: receiversEmails,
          proceedingId,
        },
      },
    }).then(() => {
      onClose();
      showToast({
        title: 'Odeslání zprávy proběhlo úspěšně.',
        description: `Zpráva byla odeslána!`,
        status: 'success',
      });
    });
  };

  useEffect(() => {
    if (error) {
      showToast({
        title: 'Odeslání zprávy se nezdařilo',
        description: 'Při odesílání zprávy došlo k problémům.',
        status: 'error',
      });
    }
  }, [error, showToast]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Hromadná zpráva</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Form
            id={'sendEmail'}
            resolver={zodResolver(baseSendEmailSchema)}
            defaultValues={{
              title: '',
              message: '',
              receivers: [],
            }}
            onSubmit={onSubmit}
          >
            <Flex direction="column" gap={4}>
              <InputField
                name="title"
                label="Napis"
                placeholder="Zadejte nadpis zprávy..."
              />
              <TextareaField
                name="message"
                label="Zpráva"
                placeholder="Zadejte zprávu pro příjemce..."
                rows={10}
              />
              <FancySelectField
                label="Příjemci:"
                name="receivers"
                placeholder="Všichni"
                isMulti
                tagColorScheme="goldenYellow"
                options={receivers
                  ?.filter((val) => val.user.email !== user?.email)
                  .map((val) => ({
                    label: val.user.email,
                    value: val.user.email,
                  }))}
                chakraStyles={{
                  container: (provided: SystemStyleObject) => ({
                    ...provided,
                    width: '100%',
                  }),
                }}
              />
            </Flex>
          </Form>
        </ModalBody>
        <ModalFooter justifyContent="center">
          <PrimaryButton type="submit" form={'sendEmail'} isLoading={loading}>
            Odeslat
          </PrimaryButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
