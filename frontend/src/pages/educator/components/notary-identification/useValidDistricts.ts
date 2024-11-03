import { useCallback, useEffect, useMemo, useState } from 'react';

import { config } from '@frontend/config.ts';

type District = {
  name: string;
};

type DistrictsResponse = {
  data: {
    districts: District[];
  };
};

const fetchValidDistricts = async () => {
  const query = `
    query Districts {
      districts {
        name
      }
    }
  `;

  const response = await fetch(config.GRAPHQL_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });

  if (!response) throw new Error('Failed to fetch districts');

  const responseData: DistrictsResponse = await response.json();
  return responseData.data.districts;
};

export const useValidDistricts = () => {
  const [validDistricts, setValidDistricts] = useState<District[]>([]);
  const [error, setError] = useState<string | null>(null);

  const loadDistricts = useCallback(async () => {
    try {
      const districts = await fetchValidDistricts();
      setValidDistricts(districts);
    } catch (err) {
      setError('Valid districts could not be fetched.');
    }
  }, []);

  useEffect(() => {
    loadDistricts();
  }, [loadDistricts]);

  const validDistrictNames = useMemo(
    () => validDistricts.map((d) => d.name),
    [validDistricts],
  );

  return { validDistrictNames, error };
};
