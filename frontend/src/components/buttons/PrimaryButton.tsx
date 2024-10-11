import { MouseEventHandler } from 'react';
import { Button, ButtonProps } from '@chakra-ui/react';

export type PrimaryButtonProps = ButtonProps & {
  label: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

export const PrimaryButton = ({
  label,
  onClick,
  variant = 'solid',
  leftIcon = undefined,
  isLoading = false,
  isDisabled = false,
  ...restProps
}: PrimaryButtonProps) => {
  return (
    <Button
      onClick={onClick}
      colorScheme="goldenYellow"
      variant={variant}
      leftIcon={leftIcon}
      px="3"
      py="2"
      isLoading={isLoading}
      isDisabled={isDisabled}
      {...restProps}
    >
      {label}
    </Button>
  );
};
