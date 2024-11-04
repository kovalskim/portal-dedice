// noinspection GraphQLUnresolvedReference

import { gql } from '@apollo/client';

export type District = {
  name: string;
};

export type DistrictsResponse = {
  districts: District[];
};

export const GET_DISTRICTS = gql`
  query GetDistricts {
    districts {
      name
    }
  }
`;
