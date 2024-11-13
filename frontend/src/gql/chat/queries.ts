import { gql } from '@apollo/client';

export const ALL_MESSAGES_BY_PROCEEDING_ID = gql`
  query AllMessagesByProceedingId($proceedingId: Float!) {
    allMessagesByProceedingId(proceedingId: $proceedingId) {
      id
      text
      timestamp
      user {
        id
        firstname
        lastname
      }
    }
  }
`;
