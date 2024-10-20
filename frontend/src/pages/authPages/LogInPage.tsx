import { useMutation } from '@apollo/client';
import { Flex, Spacer } from '@chakra-ui/react';
import { SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '@frontend/context/auth';
import { SIGN_IN_MUTATION } from '@frontend/gql/user/mutations.ts';
import { LogInForm } from '@frontend/pages/authPages/components/LogInForm.tsx';
import { FormFields } from '@frontend/pages/authPages/components/RegistrationForm.tsx';
import { Routes } from '@frontend/routes.ts';

export const LogInPage = () => {
  const navigate = useNavigate();
  const auth = useAuth();

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
      auth.signIn({ token, user });

      navigate(Routes.home);
    } catch (err) {
      console.error(error);
      console.error(err);
    }
  };

  return (
    <Flex p="8">
      <Spacer />
      <LogInForm onSubmit={onSubmit} loading={loading} error={error} />
      <Spacer />
    </Flex>
  );
};
