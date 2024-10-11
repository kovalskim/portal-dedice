import { useMutation } from '@apollo/client';
import { Box, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

import { MainLayout } from '@frontend/components/';
import { useAuth } from '@frontend/context/auth';
import { gql } from '@frontend/gql';

const SIGNIN_MUTATION = gql(/* GraphQL */ `
  mutation SignIn($email: String!, $password: String!) {
    signIn(email: $email, password: $password) {
      user {
        id
        name
        email
      }
      token
    }
  }
`);

export const SignInPage = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  const [signInRequest, signInRequestState] = useMutation(SIGNIN_MUTATION, {
    onCompleted: ({ signIn: { user, token } }) => {
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
            signInRequest({
              variables: {
                email: 'a@a.com',
                password: 'pass',
              },
            });
          }}
          isLoading={signInRequestState.loading}
        >
          Sign In
        </Button>
        {signInRequestState.error ? (
          <Box color="red">{signInRequestState.error.message}</Box>
        ) : null}
      </Box>
    </MainLayout>
  );
};
