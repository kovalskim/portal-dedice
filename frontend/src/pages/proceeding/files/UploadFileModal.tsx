import { useState } from 'react';
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
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import slugify from 'slugify';
import * as z from 'zod';

import { PrimaryButton } from '@frontend/components/buttons';
import { InputField } from '@frontend/components/forms/fields/InputField';
import { SingleFileUploadField } from '@frontend/components/forms/fields/SingleFileUploadField';
import { Form } from '@frontend/components/forms/Form';
import {
  GET_SIGNED_URL_MUTATION,
  SAVE_FILE_MUTATION,
} from '@frontend/gql/file/mutations.ts';
import { FILES_BY_PROCEEDING_ID } from '@frontend/gql/file/queries.ts';
import { useCustomToast } from '@frontend/hooks/useCustomToast.ts';
import { MAX_FILE_SIZE } from '@frontend/utils/constants.ts';

type UploadFileModalProps = {
  isOpen: boolean;
  onClose: () => void;
  proceedingId: number;
};

function checkFileType(file?: File) {
  const allowedTypes = ['pdf', 'docx'];
  return file?.name && allowedTypes.includes(file.name.split('.').pop() || '');
}

const uploadFileFormSchema = z.object({
  alias: z
    .string()
    .min(1, 'Název souboru je povinný')
    .max(255, 'Maximální délka názvu je 255 znaků'),
  uploadFile: z
    .instanceof(File, { message: 'Soubor je povinný' })
    .refine((file) => file.size < MAX_FILE_SIZE, {
      message: 'Maximální velikost souboru je 25MB',
    })
    .refine((file) => checkFileType(file), {
      message: 'Podporovány jsou pouze soubory s příponou .pdf a .docx',
    }),
});

type UploadFileFormFields = z.infer<typeof uploadFileFormSchema>;

type UploadFileType = {
  filename: string;
  rawFileType: string;
  fileType: string;
  alias: string;
  file: File;
};

export const UploadFileModal = ({
  isOpen,
  onClose,
  proceedingId,
}: UploadFileModalProps) => {
  const showToast = useCustomToast();

  const [loading, setLoading] = useState(false);

  const showUploadErrorToast = () => {
    showToast({
      title: 'Nepodařilo se uložit soubor',
      description: 'Při ukládání souboru k dědickému řízení se vyskytla chyba.',
      status: 'error',
    });
  };

  const [getSignedUrl] = useMutation(GET_SIGNED_URL_MUTATION, {
    onError: showUploadErrorToast,
  });

  const [saveFile] = useMutation(SAVE_FILE_MUTATION, {
    onError: showUploadErrorToast,
    onCompleted: () => {
      setLoading(false);
      onClose();
      showToast({
        title: 'Soubor nahrán',
        description: 'Soubor byl úspěšně nahrán.',
        status: 'success',
      });
    },
    refetchQueries: [FILES_BY_PROCEEDING_ID],
  });

  const uploadFile = async ({
    filename,
    rawFileType,
    fileType,
    alias,
    file,
  }: UploadFileType) => {
    const {
      data: {
        getSignedUrl: { url },
      },
    } = await getSignedUrl({
      variables: {
        filename: filename,
        filetype: rawFileType,
        proceedingId: proceedingId,
      },
    });

    await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': rawFileType,
      },
      body: file,
    });

    await saveFile({
      variables: {
        type: fileType,
        proceedingId: proceedingId,
        alias: alias,
        key: filename,
      },
    });
  };

  const onSubmit = async (formData: UploadFileFormFields) => {
    setLoading(true);

    if (!formData.uploadFile) return;

    const fileType =
      formData.uploadFile.type === 'application/pdf'
        ? 'pdf'
        : formData.uploadFile.type ===
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          ? 'docx'
          : 'unknown';

    const filename = `${slugify(formData.alias)}_${Date.now()}.${fileType}`;

    try {
      await uploadFile({
        filename,
        rawFileType: formData.uploadFile.type,
        fileType,
        alias: formData.alias,
        file: formData.uploadFile,
      });
    } catch (error) {
      showUploadErrorToast();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Nahrát soubor</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Form
            id={'uploadFileForm'}
            resolver={zodResolver(uploadFileFormSchema)}
            defaultValues={{
              alias: '',
              uploadFile: undefined,
            }}
            onSubmit={onSubmit}
            noValidate
          >
            <Flex direction="column" gap={4}>
              <InputField
                name="alias"
                label="Název souboru"
                placeholder="Zadejte název souboru..."
                isRequired={true}
              />
              <SingleFileUploadField
                name={'uploadFile'}
                label={'Dokument'}
                accept={
                  'application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf'
                }
                isRequired={true}
              />
            </Flex>
          </Form>
        </ModalBody>
        <ModalFooter justifyContent="center">
          <PrimaryButton
            type="submit"
            form={'uploadFileForm'}
            isLoading={loading}
          >
            Nahrát soubor
          </PrimaryButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
