import { Box, Flex, Heading, Image, Text } from '@chakra-ui/react';

import { RouterNavButton } from '@frontend/components/navigation/atoms/RouterNavButton.tsx';
import { useAuth } from '@frontend/context/auth';
import { Routes } from '@frontend/routes.ts';

export const HeroSection = () => {
  const { user } = useAuth();

  return (
    <Box as="section" py={12} px={6}>
      <Flex
        direction={{ base: 'column', md: 'row' }}
        gap={{ base: 12, md: 0 }}
        alignItems="center"
        justifyContent="space-between"
      >
        <Flex
          direction="column"
          align="start"
          maxW={{ base: '100%', md: '50%' }}
        >
          <Heading fontSize="4xl" color="gray.800" mb={12} letterSpacing="-1px">
            Portál dědice
          </Heading>
          <Text fontSize="xl" mb={14}>
            Potřebujete poradit či provést dědickým řízením? Portál dědice Vám
            poskytne vše, co potřebujete vědět a celým dědickým řízením Vás
            provede.
          </Text>
          {!user ? (
            <RouterNavButton size="lg" to={Routes.logIn}>
              Přihlásit se do Portálu dědice
            </RouterNavButton>
          ) : (
            <RouterNavButton
              size="lg"
              to={Routes.proceedings}
              minW={{ md: '280px' }}
            >
              Přejít do Portálu dědice
            </RouterNavButton>
          )}
        </Flex>
        <Flex
          maxW={{ base: '100%', md: '50%' }}
          justifyContent={{ base: 'center', md: 'end' }}
        >
          <Image src="/hero.png" alt="" w="90%" borderRadius="10px" />
        </Flex>
      </Flex>
    </Box>
  );
};
