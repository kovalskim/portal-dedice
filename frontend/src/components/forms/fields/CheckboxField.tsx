import { Checkbox, CheckboxProps } from '@chakra-ui/react';

import { FormField, type FormFieldBaseProps } from './FormField';

export type CheckboxFieldProps = FormFieldBaseProps<CheckboxProps>;

export const CheckboxField = ({
  id,
  name,
  label,
  ...restProps
}: CheckboxFieldProps) => {
  return (
    <FormField id={id} name={name}>
      {({ value, ...restField }) => (
        <Checkbox
          {...restProps}
          {...restField}
          isChecked={value}
          colorScheme="goldenYellow"
        >
          {label}
        </Checkbox>
      )}
    </FormField>
  );
};
