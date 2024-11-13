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

export const SIGN_IN_MUTATION = gql`
  mutation signIn($email: String!, $password: String!) {
    signIn(email: $email, password: $password) {
      user {
        id
        beforeTitle
        firstname
        lastname
        afterTitle
        email
      }
      role {
        id
        name
      }
      token
    }
  }
`;

export const UPDATE_USER_MUTATION = gql`
  mutation updateUser(
    $userId: String!
    $beforeTitle: String
    $firstname: String!
    $lastname: String!
    $afterTitle: String
  ) {
    updateUser(
      userId: $userId
      beforeTitle: $beforeTitle
      firstname: $firstname
      lastname: $lastname
      afterTitle: $afterTitle
    ) {
      id
      beforeTitle
      firstname
      lastname
      afterTitle
      email
    }
  }
`;

export const CHANGE_PASSWORD_MUTATION = gql`
  mutation changePassword(
    $userId: String!
    $oldPassword: String!
    $newPassword: String!
  ) {
    changePassword(
      userId: $userId
      oldPassword: $oldPassword
      newPassword: $newPassword
    ) {
      user {
        id
        beforeTitle
        firstname
        lastname
        afterTitle
        email
      }
      token
    }
  }
`;

export const RESTORE_PASSWORD_MUTATION = gql`
  mutation restorePassword($email: String!) {
    restorePassword(email: $email)
  }
`;

export const NEW_PASSWORD_MUTATION = gql`
  mutation newPassword($newPassword: String!, $token: String!) {
    newPassword(newPassword: $newPassword, token: $token)
  }
`;

export const VERIFY_TOKEN_MUTATION = gql`
  mutation verifyToken($token: String!) {
    verifyToken(token: $token)
  }
`;
