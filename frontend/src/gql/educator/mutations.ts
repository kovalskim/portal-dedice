// noinspection GraphQLUnresolvedReference

import { gql } from '@apollo/client';

export type IdentifiedNotary = {
  notaryName: string;
  secondaryNotaryName: string;
  court: {
    name: string;
  };
};

export const IDENTIFY_NOTARY = gql`
  mutation IdentifyNotary($data: DeceasedPersonInput!) {
    identifyNotary(data: $data) {
      notaryName
      secondaryNotaryName
      court {
        name
      }
    }
  }
`;
