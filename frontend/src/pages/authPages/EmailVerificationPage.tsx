import { useEffect, useRef } from 'react';
import { useMutation } from '@apollo/client';
import { Box, Center, Flex, Heading, Spinner, Text } from '@chakra-ui/react';
import { useLocation, useNavigate } from 'react-router-dom';

import { VERIFY_EMAIL_MUTATION } from '@frontend/gql/user/mutations';
import { useCustomToast } from '@frontend/hooks/useCustomToast.ts';
import { Routes } from '@frontend/routes/routes.ts';

export const EmailVerificationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const showToast = useCustomToast();

  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get('token');

  const hasVerified = useRef(false);

  const [verifyEmail, { loading }] = useMutation(VERIFY_EMAIL_MUTATION, {
    onError: (error) => {
      if (error.message.includes('expired')) {
        showToast({
          title: 'Vypadá to, že verifikační odkaz expiroval.',
          description: 'Přihlaste se a požádejte o nový.',
          status: 'error',
        });
        navigate(Routes.home);
      } else {
        showToast({
          title: 'Odkaz není validní',
          description: 'Zadejte prosím validní odkaz.',
          status: 'error',
        });
        navigate(Routes.home);
      }
    },
    onCompleted: () => {
      showToast({
        title: 'E-mailová adresa ověřena',
        description: 'Pro pokračování se, prosím, přihlaste.',
        status: 'success',
      });
      navigate(Routes.logIn);
    },
  });

  useEffect(() => {
    (async () => {
      if (token && !hasVerified.current) {
        hasVerified.current = true;
        await verifyEmail({ variables: { token } });
      }
    })();
  }, [token, hasVerified, verifyEmail]);

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
