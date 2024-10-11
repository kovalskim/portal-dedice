import { Switch, type SwitchProps } from '@frontend/shared/design-system';

import { FormField, type FormFieldBaseProps } from '../fields/FormField';

export type SwitchFieldProps = FormFieldBaseProps<SwitchProps>;

export const SwitchField = ({
  id,
  name,
  label,
  ...inputProps
}: SwitchFieldProps) => {
  return (
    <FormField
      id={id}
      name={name}
      label={label}
      isRequired={inputProps.isRequired}
    >
      {({ value, ...field }) => (
        <Switch isChecked={!!value} {...inputProps} {...field} />
      )}
    </FormField>
  );
};
