import { FC, PropsWithChildren, useEffect } from 'react';
import { Box } from '@chakra-ui/layout';
import {
  Alert,
  AlertDescription,
  AlertTitle,
  CloseButton,
  Icon,
  useBreakpointValue,
  useDisclosure,
} from '@chakra-ui/react';
import { FaQuestionCircle } from 'react-icons/fa';

import { theme } from '@frontend/components';

export type InfoHintBoxProps = {
  title: string;
};

export const InfoHintBox: FC<PropsWithChildren<InfoHintBoxProps>> = ({
  title,
  children,
}) => {
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
      <Icon
        as={FaQuestionCircle}
        boxSize={5}
        color={theme.colors.goldenYellow[700]}
        mr={5}
      />
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
