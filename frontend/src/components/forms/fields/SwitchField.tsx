import { Switch, SwitchProps } from '@chakra-ui/react';

import { FormField, type FormFieldBaseProps } from './FormField';

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
        <Switch
          isChecked={!!value}
          {...inputProps}
          {...field}
          colorScheme="goldenYellow"
        />
      )}
    </FormField>
  );
};
