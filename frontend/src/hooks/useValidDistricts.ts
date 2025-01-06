import { useMemo } from 'react';
import { useQuery } from '@apollo/client';

import {
  District,
  DistrictsResponse,
  GET_DISTRICTS,
} from '@frontend/gql/educator/queries.ts';

export const useValidDistricts = () => {
  const { data, error, loading } = useQuery<DistrictsResponse>(GET_DISTRICTS);

  // Extract the district names if data is available
  const validDistrictNames = useMemo(
    () => data?.districts.map((district: District) => district.name) || [],
    [data],
  );

  return { data, validDistrictNames, error, loading };
};
