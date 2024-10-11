import { useState } from 'react';
import { Flex } from '@chakra-ui/layout';
import { Text } from '@chakra-ui/react';

import { Input, type InputProps } from '@frontend/shared/design-system';
import { PrimaryButton } from '@frontend/shared/design-system/atoms/buttons/PrimaryButton.tsx';

import { FormField, type FormFieldBaseProps } from '../fields/FormField';

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
                label="Nahrát soubor"
              />
            </label>
            {selectedFile && <Text mt={2}>{selectedFile.name}</Text>}
          </Flex>
        </>
      )}
    </FormField>
  );
};
