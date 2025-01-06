import { ReactSelectBaseProps, Select } from 'chakra-react-select';

import { FormField, type FormFieldBaseProps } from './FormField';

export type FancySelectFieldProps = FormFieldBaseProps<
  // dont have time for this shit
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Partial<ReactSelectBaseProps<any, any, any>>
>;

export const FancySelectField = ({
  id,
  name,
  label,
  ...selectProps
}: FancySelectFieldProps) => {
  return (
    <FormField
      id={id}
      name={name}
      label={label}
      isRequired={selectProps.isRequired}
    >
      {(field) => (
        <Select
          {...selectProps}
          {...field}
          tagColorScheme="goldenYellow"
          selectedOptionColorScheme="goldenYellow"
        />
      )}
    </FormField>
  );
};
