import { useMutation } from '@apollo/client';
import { Box, Center, Heading } from '@chakra-ui/react';
import { SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { SIGN_UP_MUTATION } from '@frontend/gql/user/mutations';
import { Routes } from '@frontend/routes';

import { FormFields, RegistrationForm } from './components/RegistrationForm';

export const SignUpPage = () => {
  const navigate = useNavigate();
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
    <Box p="8" alignItems="center">
      <Center mb="10">
        <Heading>Registrace do portálu dědice</Heading>
      </Center>
      <RegistrationForm onSubmit={onSubmit} loading={loading} error={error} />
    </Box>
  );
};
