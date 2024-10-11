import { ReactNode, useEffect } from 'react';
import { Box } from '@chakra-ui/layout';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  CloseButton,
  useBreakpointValue,
  useDisclosure,
} from '@chakra-ui/react';

export type InfoHintBoxProps = {
  title: string;
  children: ReactNode;
};

export const InfoHintBox = ({ title, children }: InfoHintBoxProps) => {
  const isMobile: boolean | undefined = useBreakpointValue({
    base: true,
    md: false,
  });

  const {
    isOpen: isVisible,
    onClose,
    onOpen,
  } = useDisclosure({ defaultIsOpen: isMobile });

  useEffect(() => {
    if (isMobile === true) {
      onClose();
    } else {
      onOpen();
    }
  }, [isMobile, onClose, onOpen]);

  return (
    <Alert
      status="info"
      borderRadius={10}
      onClick={onOpen}
      colorScheme="goldenYellow"
      cursor="pointer"
    >
      <AlertIcon />
      <Box>
        <AlertTitle>
          {title} {!isVisible && <>...</>}
        </AlertTitle>
        {isVisible && <AlertDescription>{children}</AlertDescription>}
      </Box>
      {isVisible && (
        <CloseButton
          alignSelf="flex-start"
          position="absolute"
          right={2}
          top={2}
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
        />
      )}
    </Alert>
  );
};
