import { gql } from '@apollo/client';

export const FILES_BY_PROCEEDING_ID = gql`
  query FilesByProceeding($proceedingId: Float!) {
    filesByProceeding(proceedingId: $proceedingId) {
      id
      alias
      path
      timestamp
      type
      user {
        id
        beforeTitle
        firstname
        lastname
        afterTitle
      }
    }
  }
`;
