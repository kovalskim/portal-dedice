import { Select, type SelectProps } from '@chakra-ui/react';

import { FormField, type FormFieldBaseProps } from '../fields/FormField';

export type SelectFieldProps = FormFieldBaseProps<SelectProps>;

export const SelectField = ({
  id,
  name,
  label,
  children,
  ...selectProps
}: SelectFieldProps) => {
  return (
    <FormField
      id={id}
      name={name}
      label={label}
      isRequired={selectProps.isRequired}
    >
      {(field) => (
        <Select {...selectProps} {...field}>
          {children}
        </Select>
      )}
    </FormField>
  );
};
