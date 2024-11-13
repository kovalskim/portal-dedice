import gql from 'graphql-tag';

export const CHAT_SUBSCRIPTION = gql`
  subscription Subscription($proceedingId: Float!) {
    subscribeChat(proceedingId: $proceedingId) {
      id
    }
  }
`;
