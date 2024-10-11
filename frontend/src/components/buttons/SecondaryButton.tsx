import { MouseEventHandler } from 'react';
import { Button, ButtonProps } from '@chakra-ui/react';

export type SecondaryButtonProps = ButtonProps & {
  label: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

export const SecondaryButton = ({
  label,
  onClick,
  variant = 'solid',
  leftIcon = undefined,
  isLoading = false,
  isDisabled = false,
  ...restProps
}: SecondaryButtonProps) => {
  return (
    <Button
      onClick={onClick}
      colorScheme="gray"
      variant={variant}
      leftIcon={leftIcon}
      px="4"
      py="2"
      isLoading={isLoading}
      isDisabled={isDisabled}
      {...restProps}
    >
      {label}
    </Button>
  );
};
