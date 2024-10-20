import { gql } from '@apollo/client';

export const SIGN_UP_MUTATION = gql`
  mutation signUp(
    $email: String!
    $password: String!
    $firstname: String!
    $lastname: String!
  ) {
    signUp(
      email: $email
      password: $password
      firstname: $firstname
      lastname: $lastname
    ) {
      token
    }
  }
`;

export const VERIFY_EMAIL_MUTATION = gql`
  mutation Mutation($token: String!) {
    verifyEmail(token: $token)
  }
`;
