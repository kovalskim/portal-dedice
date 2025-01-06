import { useMemo } from 'react';
import { useQuery } from '@apollo/client';

import { Court, GET_COURTS } from '@frontend/gql/user/queries.ts';

export const useCourts = () => {
  const { data, error, loading } = useQuery(GET_COURTS);

  const courtNames = useMemo(
    () => data?.courts.map((court: Court) => court.name) || [],
    [data],
  );

  return { data, courts: data?.courts, courtNames, error, loading };
};
