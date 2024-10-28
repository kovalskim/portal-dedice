import { useState } from 'react';
import { Flex } from '@chakra-ui/layout';
import { Input, InputProps, Text } from '@chakra-ui/react';

import { PrimaryButton } from '@frontend/components';

import { FormField, type FormFieldBaseProps } from './FormField';

export type SingleFileUploadFieldProps = FormFieldBaseProps<
  Omit<InputProps, 'multiple'>
>;

export const SingleFileUploadField = ({
  id,
  name,
  label,
  ...inputProps
}: SingleFileUploadFieldProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
  };

  return (
    <FormField
      id={id}
      name={name}
      label={label}
      isRequired={inputProps.isRequired}
    >
      {({ value, onChange, ...restField }) => (
        <>
          <Input
            id="file-upload" // unique id for the input
            type="file"
            display="none" // hides the native file input
            onChange={handleFileChange}
            colorScheme="goldenYellow"
          />

          <Flex
            direction="row"
            gap="2"
            borderColor="gray.200"
            borderWidth="1px"
            borderRadius="6px"
            py="2"
            px="3"
          >
            <label htmlFor="file-upload">
              <PrimaryButton
                as="span" // little hack (there cannot be a button in a label)
                colorScheme="goldenYellow"
                cursor="pointer"
              >
                Nahrát soubor
              </PrimaryButton>
            </label>
            {selectedFile && <Text mt={2}>{selectedFile.name}</Text>}
          </Flex>
        </>
      )}
    </FormField>
  );
};
