import { type ReactNode } from 'react';
import {
  type FieldValues,
  FormProvider,
  type SubmitHandler,
  useForm,
  type UseFormProps,
} from 'react-hook-form';

export type FormProps<TFieldValues extends FieldValues = FieldValues> =
  UseFormProps<TFieldValues> & {
    id?: string;
    children: ReactNode;
    onSubmit: SubmitHandler<TFieldValues>;
    noValidate?: boolean;
  };

export function Form<TFieldValues extends FieldValues = FieldValues>({
  id,
  children,
  onSubmit,
  noValidate = false,
  ...rest
}: FormProps<TFieldValues>) {
  const methods = useForm<TFieldValues>(rest);

  return (
    <FormProvider {...methods}>
      <form
        id={id}
        onSubmit={methods.handleSubmit(onSubmit)}
        noValidate={noValidate}
      >
        {children}
      </form>
    </FormProvider>
  );
}
