import { Input, type InputProps } from '@frontend/shared/design-system';

import { FormField, type FormFieldBaseProps } from '../fields/FormField';

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
