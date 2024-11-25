import { useMutation } from '@apollo/client';
import {
  Box,
  Flex,
  Heading,
  Image,
  useBreakpointValue,
} from '@chakra-ui/react';
import { SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { RESTORE_PASSWORD_MUTATION } from '@frontend/gql/user/mutations.ts';
import { useCustomToast } from '@frontend/hooks/useCustomToast.ts';
import {
  ForgottenPasswordForm,
  FormFields,
} from '@frontend/pages/authPages/components/ForgottenPasswordForm.tsx';
import { Routes } from '@frontend/routes/routes.ts';

export const ForgottenPasswordPage = () => {
  const navigate = useNavigate();

  const [restorePassword, { loading, error }] = useMutation(
    RESTORE_PASSWORD_MUTATION,
  );

  const isMobile = useBreakpointValue({ base: true, md: false });

  const showToast = useCustomToast();

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      await restorePassword({
        variables: {
          email: data.email,
        },
      });

      showToast({
        title: 'Obnovení hesla',
        description: 'Pokyny pro obnovení hesla byly odeslány na e-mail',
        status: 'success',
      });

      navigate(Routes.logIn);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      {isMobile ? (
        <Flex h="100%" w="100%" justifyContent="center" alignItems="center">
          <Box
            w="90%"
            bg="white"
            py={10}
            px={12}
            display="flex"
            flexDirection="column"
            justifyContent="center"
            boxShadow="lg"
            borderRadius="lg"
          >
            <ForgottenPasswordForm
              onSubmit={onSubmit}
              loading={loading}
              error={error}
            />
          </Box>
        </Flex>
      ) : (
        <Flex h="100%" w="100%" justifyContent="center" alignItems="center">
          <Flex
            width={{
              md: '90%',
              lg: '80%',
            }}
            boxShadow="lg"
            borderRadius="lg"
          >
            <Flex
              w="45%"
              bg="goldenYellow.500"
              color="white"
              px={10}
              py={24}
              direction="column"
              alignItems="center"
              justifyContent="center"
              textAlign="center"
              borderLeftRadius="lg"
            >
              <Heading size="lg" mb={12} lineHeight="3rem">
                Zapomenuté heslo
              </Heading>
              <Image src="/forgotten-password.png" width="300px" />
            </Flex>
            <Box
              w="55%"
              bg="white"
              py="10"
              px={{
                md: '12',
                lg: '16',
                xl: '20',
              }}
              display="flex"
              flexDirection="column"
              justifyContent="center"
              borderRightRadius="lg"
            >
              <ForgottenPasswordForm
                onSubmit={onSubmit}
                loading={loading}
                error={error}
              />
            </Box>
          </Flex>
        </Flex>
      )}
    </>
  );
};
