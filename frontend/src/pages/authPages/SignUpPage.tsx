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
import { useCustomToast } from '@frontend/hooks/useCustomToast.ts';
import { Routes } from '@frontend/routes/routes.ts';

import { FormFields, RegistrationForm } from './components/RegistrationForm';

export const SignUpPage = () => {
  const navigate = useNavigate();
  const isMobile = useBreakpointValue({ base: true, md: false });

  const showToast = useCustomToast();

  const [signUp, { loading }] = useMutation(SIGN_UP_MUTATION, {
    onError: (error) => {
      if (error?.graphQLErrors[0]?.extensions?.code === 'VALIDATION_ERROR') {
        showToast({
          title: 'Registrace se nezdařila.',
          description:
            'Zadané registrační údaje se neshodují s údaji z pozvánky.',
          status: 'error',
        });
      } else if (
        error?.graphQLErrors[0]?.extensions?.code === 'ALREADY_EXISTING'
      ) {
        showToast({
          title: 'Registrace se nezdařila.',
          description: 'Uživatel se zadanou emailovou adresou již existuje.',
          status: 'error',
        });
      } else {
        showToast({
          title: 'Registrace se nezdařila.',
          description:
            'Registraci nyní nelze provést, zkuste to prosím později.',
          status: 'error',
        });
      }
    },
    onCompleted: () => {
      navigate(Routes.emailConfirmation);
    },
  });

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    await signUp({
      variables: {
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        password: data.password,
        token: data.token,
      },
    });
  };

  const registrationForm = (
    <RegistrationForm onSubmit={onSubmit} loading={loading} />
  );

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
            {registrationForm}
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
              {registrationForm}
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
