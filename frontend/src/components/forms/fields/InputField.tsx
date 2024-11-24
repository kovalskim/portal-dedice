import { forwardRef } from 'react';
import { Input, InputProps } from '@chakra-ui/react';

import { theme } from '@frontend/components/design-system';

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
        {(field) => (
          <Input
            focusBorderColor={theme.colors.goldenYellow[500]}
            {...inputProps}
            {...field}
            ref={ref}
          />
        )}
      </FormField>
    );
  },
);
