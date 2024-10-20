import { forwardRef } from 'react';
import { Input, InputProps } from '@chakra-ui/react';

import { FormField, type FormFieldBaseProps } from './FormField';

export type InputFieldProps = FormFieldBaseProps<InputProps>;

export const InputField = forwardRef(
  ({ id, name, label, ...inputProps }: InputFieldProps, ref) => {
    return (
      <FormField
        id={id}
        name={name}
        label={label}
        isRequired={inputProps.isRequired}
      >
        {(field) => <Input {...inputProps} {...field} ref={ref} />}
      </FormField>
    );
  },
);
