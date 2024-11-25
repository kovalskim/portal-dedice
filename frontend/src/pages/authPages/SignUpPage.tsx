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

import { SIGN_UP_MUTATION } from '@frontend/gql/user/mutations';
import { Routes } from '@frontend/routes/routes.ts';

import { FormFields, RegistrationForm } from './components/RegistrationForm';

export const SignUpPage = () => {
  const navigate = useNavigate();
  const isMobile = useBreakpointValue({ base: true, md: false });

  const [signUp, { loading, error }] = useMutation(SIGN_UP_MUTATION);

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      await signUp({
        variables: {
          firstname: data.firstname,
          lastname: data.lastname,
          email: data.email,
          password: data.password,
        },
      });
      navigate(Routes.emailConfirmation);
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
            my={12}
            py={10}
            px={12}
            display="flex"
            flexDirection="column"
            justifyContent="center"
            boxShadow="lg"
            borderRadius="lg"
          >
            <RegistrationForm
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
            <Box
              w="55%"
              bg="white"
              px={{
                md: '4',
                lg: '8',
                xl: '14',
              }}
              py={14}
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              borderLeftRadius="lg"
            >
              <RegistrationForm
                onSubmit={onSubmit}
                loading={loading}
                error={error}
              />
            </Box>
            <Box
              w="45%"
              bg="goldenYellow.500"
              color="white"
              px={10}
              py={16}
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              textAlign="center"
              borderRightRadius="lg"
            >
              <Heading size="lg" mb={12} lineHeight="3rem">
                Zaregistrujte se do <br /> Portálu dědice
              </Heading>
              <Image src="/registration.png" width="300px" />
            </Box>
          </Flex>
        </Flex>
      )}
    </>
  );
};
