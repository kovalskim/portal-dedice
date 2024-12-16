import { Flex } from '@chakra-ui/layout';
import { Input, InputProps, Text } from '@chakra-ui/react';

import { PrimaryButton } from '@frontend/components/buttons';

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
            {...inputProps}
            {...restField}
            id="file-upload" // unique id for the input
            type="file"
            display="none" // hides the native file input
            onChange={(event) => onChange(event.target.files?.[0] ?? null)}
            colorScheme="goldenYellow"
            value={value?.fileName}
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
                variant="outline"
              >
                Vyberte soubor
              </PrimaryButton>
            </label>
            {value && value.name && <Text mt={2}>{value.name}</Text>}
          </Flex>
        </>
      )}
    </FormField>
  );
};
