import { RadioGroup, type RadioGroupProps } from '@chakra-ui/react';

import { FormField, type FormFieldBaseProps } from '../fields/FormField';

export type RadioGroupFieldProps = FormFieldBaseProps<RadioGroupProps>;

export const RadioGroupField = ({
  id,
  name,
  label,
  children,
  ...radioProps
}: RadioGroupFieldProps) => {
  return (
    <FormField
      id={id}
      name={name}
      label={label}
      isRequired={radioProps.isRequired}
    >
      {(field) => (
        <RadioGroup {...radioProps} {...field}>
          {children}
        </RadioGroup>
      )}
    </FormField>
  );
};
