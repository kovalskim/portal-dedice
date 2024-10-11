import { useMutation } from '@apollo/client';
import { Box, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

import { MainLayout } from '@frontend/components';
import { useAuth } from '@frontend/context/auth';
import { gql } from '@frontend/gql';

const SIGNUP_MUTATION = gql(/* GraphQL */ `
  mutation SignUp($email: String!, $name: String!, $password: String!) {
    signUp(email: $email, name: $name, password: $password) {
      user {
        id
        name
        email
      }
      token
    }
  }
`);

export const SignUpPage = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [signUpRequest, signUpRequestState] = useMutation(SIGNUP_MUTATION, {
    onCompleted: ({ signUp: { user, token } }) => {
      auth.signIn({ token, user });
      navigate('/');
    },
    onError: () => {},
  });

  return (
    <MainLayout>
      <Box p="8">
        <Button
          onClick={() => {
            signUpRequest({
              variables: {
                email: 'a@a.com',
                name: 'John Doe',
                password: 'pass',
              },
            });
          }}
          isLoading={signUpRequestState.loading}
        >
          Sign Up
        </Button>
        {signUpRequestState.error ? (
          <Box color="red">{signUpRequestState.error.message}</Box>
        ) : null}
      </Box>
    </MainLayout>
  );
};
