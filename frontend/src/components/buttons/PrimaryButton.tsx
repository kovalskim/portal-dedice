import { Button, ButtonProps } from '@chakra-ui/react';

export type PrimaryButtonProps = ButtonProps;

export const PrimaryButton = ({
  children,
  ...restProps
}: PrimaryButtonProps) => {
  return (
    <Button colorScheme="goldenYellow" px="4" py="2" {...restProps}>
      {children}
    </Button>
  );
};
