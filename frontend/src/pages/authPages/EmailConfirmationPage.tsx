import { Box, Center, Heading, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

import { SecondaryButton } from '@frontend/components';
import { Routes } from '@frontend/routes';

export const EmailConfirmationPage = () => {
  const navigate = useNavigate();
  return (
    <Box p="8" alignItems="center">
      <Center mb="10">
        <Heading>Na váš email jsme zaslali odkaz</Heading>
      </Center>
      <Center>
        <Text>
          Klikněte na odkaz, který jsme zaslali na vaši emailovou schránku. Díky
          tomu budeme moci ověřit vaši emailovou adresu
        </Text>
      </Center>
      <Center mt="5">
        <SecondaryButton
          children="Domů"
          onClick={() => navigate(Routes.home)}
        />
      </Center>
    </Box>
  );
};
