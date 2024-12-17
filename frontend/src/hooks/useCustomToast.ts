import { useCallback } from 'react';
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

  // Memoize the toast function (doesn't get recreated on every render, to avoid unnecessary re-renders)
  return useCallback(
    ({
      title,
      description,
      status = 'info',
      duration = 4000,
      isClosable = true,
      position = 'bottom-right',
    }: ToastParams) => {
      toast({ title, description, status, duration, isClosable, position });
    },
    [toast],
  );
};
