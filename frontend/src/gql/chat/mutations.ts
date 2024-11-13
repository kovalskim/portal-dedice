import { gql } from '@apollo/client';

export const CREATE_MESSAGE_MUTATION = gql`
  mutation CreateMessage($text: String!, $proceedingId: Float!) {
    createMessage(text: $text, proceedingId: $proceedingId) {
      id
      text
      timestamp
    }
  }
`;
