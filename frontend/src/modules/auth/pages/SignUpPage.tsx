import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

import { gql } from '@frontend/gql';
import { useAuth } from '@frontend/modules/auth';
import { Box, Button, MainLayout } from '@frontend/shared/design-system';

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

export function SignUpPage() {
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
}
