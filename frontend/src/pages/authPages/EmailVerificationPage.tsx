import { useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { Box, Center, Flex, Heading, Spinner, Text } from '@chakra-ui/react';
import { useLocation, useNavigate } from 'react-router-dom';

import { VERIFY_EMAIL_MUTATION } from '@frontend/gql/user/mutations';
import { useCustomToast } from '@frontend/hooks/useCustomToast.ts';
import { Routes } from '@frontend/routes';

export const EmailVerificationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [verifyEmail, { data, loading, error }] = useMutation(
    VERIFY_EMAIL_MUTATION,
  );
  const showToast = useCustomToast();

  // Extract token from the URL query parameters
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get('token');

  useEffect(() => {
    if (error && error.message.includes('expired')) {
      showToast({
        title: 'Vypadá to, že verifikační odkaz expiroval.',
        description: 'Přihlaste se a požádejte o nový.',
        status: 'error',
      });
      navigate(Routes.home);
    } else if (error) {
      showToast({
        title: 'Odkaz není validní',
        description: 'Zadejte prosím validní odkaz.',
        status: 'error',
      });
      navigate(Routes.home);
    }
  }, [error, navigate, showToast]);

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

  useEffect(() => {
    if (data) {
      showToast({
        title: 'E-mailová adresa ověřena',
        description: 'Pro pokračování se, prosím, přihlaste.',
        status: 'success',
      });
      navigate(Routes.logIn);
    }
  }, [data, showToast, navigate]);

  return (
    <Flex
      height="100%"
      width="100%"
      justifyContent="center"
      alignItems="center"
    >
      <Flex
        w={{
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
          base: 4,
          lg: 24,
        }}
        py={8}
      >
        <Box p="8" alignItems="center">
          <Center>
            <Heading size="lg" mb={10} color="white">
              Ověření emailové adresy
            </Heading>
          </Center>

          {loading && (
            <Flex direction="column" alignItems="center">
              <Spinner color="white" size="xl" mb="10" />
              <Text color="white">Ověřuji emailovou adresu...</Text>
            </Flex>
          )}
        </Box>
      </Flex>
    </Flex>
  );
};
