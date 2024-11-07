import { useToast, UseToastOptions } from '@chakra-ui/react';

type ToastParams = {
  title: string;
  description?: string;
  status?: UseToastOptions['status'];
  duration?: number;
  isClosable?: boolean;
  position?: UseToastOptions['position'];
};

export const useCustomToast = () => {
  const toast = useToast();

  return ({
    title,
    description,
    status = 'info',
    duration = 4000,
    isClosable = true,
    position = 'bottom-right',
  }: ToastParams) => {
    toast({ title, description, status, duration, isClosable, position });
  };
};
