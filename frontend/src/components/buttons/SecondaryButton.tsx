import { Button, ButtonProps } from '@chakra-ui/react';

export type SecondaryButtonProps = ButtonProps;

export const SecondaryButton = ({
  children,
  ...restProps
}: SecondaryButtonProps) => {
  return (
    <Button colorScheme="gray" px="4" py="2" {...restProps}>
      {children}
    </Button>
  );
};
