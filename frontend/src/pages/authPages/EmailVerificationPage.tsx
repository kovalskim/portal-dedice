import { useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { WarningIcon } from '@chakra-ui/icons';
import { Box, Center, Flex, Heading, Spinner, Text } from '@chakra-ui/react';
import { useLocation, useNavigate } from 'react-router-dom';

import { SecondaryButton } from '@frontend/components';
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

          {/* Handle error state */}
          {error && (
            <Center flexDirection="column">
              <WarningIcon color="red.600" boxSize={16} mb={4} />
              <Text color="white" mb={10} fontSize="lg" fontWeight="medium">
                {error.message.includes('expired')
                  ? 'Vypadá to, že verifikační odkaz expiroval. Přihlaste se a požádejte o nový.'
                  : 'Odkaz není validní. Zadejte prosím validní odkaz.'}
              </Text>
              <SecondaryButton
                onClick={() => navigate(Routes.home)}
                colorScheme="gray"
              >
                Návrat na hlavní stránku
              </SecondaryButton>
            </Center>
          )}
        </Box>
      </Flex>
    </Flex>
  );
};
