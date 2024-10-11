import { Input, InputProps } from '@chakra-ui/react';

import { FormField, type FormFieldBaseProps } from './FormField';

export type InputFieldProps = FormFieldBaseProps<InputProps>;

export const InputField = ({
  id,
  name,
  label,
  ...inputProps
}: InputFieldProps) => {
  return (
    <FormField
      id={id}
      name={name}
      label={label}
      isRequired={inputProps.isRequired}
    >
      {(field) => <Input {...inputProps} {...field} />}
    </FormField>
  );
};
