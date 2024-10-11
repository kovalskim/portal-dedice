import { Checkbox, type CheckboxProps } from '@frontend/shared/design-system';

import { FormField, type FormFieldBaseProps } from '../fields/FormField';

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
        <Checkbox {...restProps} {...restField} isChecked={value}>
          {label}
        </Checkbox>
      )}
    </FormField>
  );
};
