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

import { useAuth } from '@frontend/context/auth';
import { SIGN_IN_MUTATION } from '@frontend/gql/user/mutations.ts';
import { useCustomToast } from '@frontend/hooks/useCustomToast.ts';
import {
  FormFields,
  LogInForm,
} from '@frontend/pages/authPages/components/LogInForm.tsx';
import { Routes } from '@frontend/routes.ts';

export const LogInPage = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const showToast = useCustomToast();
  const isMobile = useBreakpointValue({ base: true, md: false });

  const [signIn, { loading, error }] = useMutation(SIGN_IN_MUTATION);

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      const userData = await signIn({
        variables: {
          email: data.email,
          password: data.password,
        },
      });

      const token = userData.data.signIn.token;
      const user = userData.data.signIn.user;
      const role = userData.data.signIn.role.name;
      auth.signIn({ token, user, role });

      showToast({
        title: 'Přihlášení proběhlo úspěšně',
        description: `Vítejte zpět, ${user.firstname}!`,
        status: 'success',
      });

      navigate(Routes.proceedings);
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
            <LogInForm onSubmit={onSubmit} loading={loading} error={error} />
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
                Přihlaste se do <br /> Portálu dědice
              </Heading>
              <Image src="/login.png" width="300px" />
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
              <LogInForm onSubmit={onSubmit} loading={loading} error={error} />
            </Box>
          </Flex>
        </Flex>
      )}
    </>
  );
};
