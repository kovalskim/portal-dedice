// noinspection GraphQLUnresolvedReference

import { gql } from '@apollo/client';

export type District = {
  id: number;
  name: string;
};

export type DistrictsResponse = {
  districts: District[];
};

export const GET_DISTRICTS = gql`
  query GetDistricts {
    districts {
      id
      name
    }
  }
`;
