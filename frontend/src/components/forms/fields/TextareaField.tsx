import { forwardRef } from 'react';
import { Textarea, TextareaProps } from '@chakra-ui/react';

import { theme } from '@frontend/components';

import { FormField, type FormFieldBaseProps } from './FormField';

export type TextareaFieldProps = FormFieldBaseProps<TextareaProps>;

export const TextareaField = forwardRef(
  ({ id, name, label, ...inputProps }: TextareaFieldProps, ref) => {
    return (
      <FormField
        id={id}
        name={name}
        label={label}
        isRequired={inputProps.isRequired}
      >
        {(field) => (
          <Textarea
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
