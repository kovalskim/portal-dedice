import { useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { Box, Center, Heading, Text } from '@chakra-ui/react';
import { useLocation, useNavigate } from 'react-router-dom';

import { PrimaryButton, SecondaryButton } from '@frontend/components';
import { VERIFY_EMAIL_MUTATION } from '@frontend/gql/user/mutations';
import { Routes } from '@frontend/routes';

export const EmailVerificationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [verifyEmail, { data, loading, error }] = useMutation(
    VERIFY_EMAIL_MUTATION,
  );

  // Extract token from the URL query parameters
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      const verify = async () => {
        try {
          await verifyEmail({ variables: { token } });
        } catch (err) {
          console.error('Error verifying email:', err);
        }
      };

      verify();
    }
  }, [token, verifyEmail]);

  const handleGoHome = () => {
    navigate(Routes.home);
  };

  return (
    <Box p="8" alignItems="center">
      <Center mb="10">
        <Heading>Ověření emailové adresy</Heading>
      </Center>

      {loading && (
        <Center>
          <Text>Ověřuji emailovou adresu...</Text>
        </Center>
      )}

      {/* Handle error state */}
      {error && (
        <Center flexDirection="column">
          <Text color="red.500" mb="4">
            {error.message.includes('expired')
              ? 'Vypadá to, že verifikační odkaz expiroval. Přihlaste se a požádejte o nový.'
              : 'Odkaz není validní. Zadejte prosím validní odkaz.'}
          </Text>
          <SecondaryButton onClick={handleGoHome} colorScheme="gray">
            Domů
          </SecondaryButton>
        </Center>
      )}

      {/* Handle success state */}
      {data && (
        <Center flexDirection="column">
          <Text>Úspěšně jste ověřili emailovou adresu!</Text>
          <PrimaryButton onClick={handleGoHome} mt="4">
            Domů
          </PrimaryButton>
        </Center>
      )}
    </Box>
  );
};
