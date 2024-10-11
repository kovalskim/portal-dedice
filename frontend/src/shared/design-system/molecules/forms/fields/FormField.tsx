import {
  type ControllerRenderProps,
  FieldValues,
  useController,
} from 'react-hook-form';

import {
  Field,
  FieldProps,
} from '@frontend/shared/design-system/molecules/forms/fields/Field';

type BaseProps = Pick<FieldProps, 'id' | 'label' | 'isRequired'> & {
  name: string;
};

export type FormFieldBaseProps<TInputProps> = BaseProps &
  Omit<TInputProps, keyof BaseProps>;

export type FormFieldProps = BaseProps & {
  children: (
    controller: ControllerRenderProps<FieldValues, string>,
  ) => React.ReactNode;
};

export const FormField = ({ name, children, ...restProps }: FormFieldProps) => {
  const controller = useController({ name });

  return (
    <Field error={controller?.fieldState?.error?.message} {...restProps}>
      {children(controller.field)}
    </Field>
  );
};
