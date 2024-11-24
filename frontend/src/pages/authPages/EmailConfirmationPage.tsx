import { Flex, Heading, Image, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

import { SecondaryButton } from '@frontend/components/buttons';
import { Routes } from '@frontend/routes/routes';

export const EmailConfirmationPage = () => {
  const navigate = useNavigate();
  return (
    <Flex
      height="100%"
      width="100%"
      justifyContent="center"
      alignItems="center"
    >
      <Flex
        maxW={{
          base: '90%',
          md: '70%',
          lg: '60%',
        }}
        bg="goldenYellow.500"
        boxShadow="lg"
        borderRadius="lg"
        direction="column"
        alignItems="center"
        textAlign="center"
        px={{
          base: 6,
          md: 12,
          lg: 16,
        }}
        py={12}
      >
        <Image src="/email.png" width="150px" mb={4} />
        <Heading size="lg" mb={6} color="white">
          Potvrďte svoji e-mailovou adresu
        </Heading>
        <Text mb="8" color="white">
          Klikněte, prosím, na odkaz, který jsme zaslali na vaši emailovou
          schránku. Díky tomu budeme moci ověřit vaši emailovou adresu.
        </Text>
        <SecondaryButton variant="solid" onClick={() => navigate(Routes.home)}>
          Návrat na hlavní stránku
        </SecondaryButton>
      </Flex>
    </Flex>
  );
};
