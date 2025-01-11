import { type ReactNode } from 'react';
import { FormControl, FormErrorMessage, FormLabel } from '@chakra-ui/react';

export type FieldProps = {
  id?: string;
  label?: ReactNode;
  isRequired?: boolean;
  error?: string;
  children: ReactNode;
};

export const Field = ({
  id,
  label,
  isRequired,
  error,
  children,
}: FieldProps) => {
  return (
    <FormControl id={id} isRequired={isRequired} isInvalid={!!error}>
      {label && <FormLabel me={0}>{label}</FormLabel>}
      {children}
      <FormErrorMessage>{error}</FormErrorMessage>
    </FormControl>
  );
};
