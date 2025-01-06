import { RadioGroup, type RadioGroupProps } from '@chakra-ui/react';

import { FormField, type FormFieldBaseProps } from './FormField';

export type RadioGroupFieldProps = FormFieldBaseProps<RadioGroupProps>;

export const RadioGroupField = ({
  id,
  name,
  label,
  onChange, // Support onChange callback
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
        <RadioGroup
          {...radioProps}
          {...field}
          colorScheme="goldenYellow"
          onChange={(value) => {
            // Call onChange if provided
            if (onChange) onChange(value);

            // Also propagate the change to the form field
            field.onChange(value);
          }}
        >
          {children}
        </RadioGroup>
      )}
    </FormField>
  );
};
