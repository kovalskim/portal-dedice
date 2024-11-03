import { HamburgerIcon } from '@chakra-ui/icons';
import { Box } from '@chakra-ui/layout';
import {
  Container,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  Flex,
  IconButton,
  Stack,
  useBreakpointValue,
  useDisclosure,
} from '@chakra-ui/react';

import { AuthButton } from '@frontend/components/navigation/atoms/AuthButton.tsx';
import { Logo } from '@frontend/components/navigation/atoms/Logo.tsx';
import { NavigationLinks } from '@frontend/components/navigation/atoms/NavigationLinks.tsx';

export const TopNavigation = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Box position="sticky" top="0" zIndex="100" bg="white">
      <Container maxW="container.xl">
        <Stack
          bg="white"
          py="4"
          direction="row"
          spacing="0"
          alignItems="center"
          display="flex"
          justifyContent="space-between"
        >
          <>
            {/* Hamburger Menu for Mobile */}
            {isMobile ? (
              <>
                <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
                  <DrawerOverlay />
                  <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerBody>
                      <Flex direction="column" align="center" mt="10" gap="5">
                        <NavigationLinks onClose={onClose} />
                      </Flex>
                    </DrawerBody>
                  </DrawerContent>
                </Drawer>
                <Flex direction="row" alignItems="center">
                  <IconButton
                    icon={<HamburgerIcon />}
                    aria-label="Open menu"
                    onClick={onOpen}
                    bg="none"
                    me="1"
                  />
                  <Logo />
                </Flex>
                <AuthButton onClose={onClose}></AuthButton>
              </>
            ) : (
              // Desktop View
              <>
                <Logo />
                <Stack direction="row" gap="6">
                  <NavigationLinks />
                </Stack>
                <AuthButton onClose={onClose}></AuthButton>
              </>
            )}
          </>
        </Stack>
      </Container>
    </Box>
  );
};
