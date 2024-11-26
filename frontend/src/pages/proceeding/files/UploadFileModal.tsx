import { useEffect, useState } from 'react';
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

import {
  Form,
  InputField,
  PrimaryButton,
  SingleFileUploadField,
} from '@frontend/components';
import {
  GET_SIGNED_URL_MUTATION,
  SAVE_FILE_MUTATION,
} from '@frontend/gql/file/mutations.ts';
import { useCustomToast } from '@frontend/hooks/useCustomToast.ts';
import { MAX_FILE_SIZE } from '@frontend/utils/constants.ts';

type UploadFileModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
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

export const UploadFileModal = ({
  isOpen,
  onClose,
  onSuccess,
  proceedingId,
}: UploadFileModalProps) => {
  const [getSignedUrl, { error: getSignedUrlError }] = useMutation(
    GET_SIGNED_URL_MUTATION,
  );

  const [saveFile, { error: saveFileError }] = useMutation(SAVE_FILE_MUTATION);

  const showToast = useCustomToast();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (getSignedUrlError || saveFileError) {
      showToast({
        title: 'Nepodařilo se uložit soubor',
        description:
          'Při ukládání souboru k dědickému řízení se vyskytla chyba.',
        status: 'error',
      });
    }
  }, [getSignedUrlError, saveFileError, showToast]);

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
      const response = await getSignedUrl({
        variables: {
          filename: filename,
          filetype: formData.uploadFile.type,
          proceedingId: proceedingId,
        },
      });

      const { url } = response.data.getSignedUrl;

      await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': formData.uploadFile.type,
        },
        body: formData.uploadFile,
      });

      console.log(formData.uploadFile.type);
      await saveFile({
        variables: {
          type: fileType,
          proceedingId: proceedingId,
          alias: formData.alias,
          key: filename,
        },
      });

      setLoading(false);

      onSuccess();
    } catch (error) {
      console.error('Upload failed:', error);
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
