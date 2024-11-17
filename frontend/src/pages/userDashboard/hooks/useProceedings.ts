import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';

import {
  GET_ALL_PROCEEDINGS,
  ProceedingsResponse,
} from '@frontend/gql/proceedings/queries.ts';

const PAGE_SIZE = 5;

type FilterData = {
  proceedingNumber: string;
  deceasedName: string;
  startDate: string;
  phaseId: number;
  filterStatus: string;
};

export const useProceedings = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterData, setFilterData] = useState<FilterData>({
    proceedingNumber: '',
    deceasedName: '',
    startDate: '',
    phaseId: 0,
    filterStatus: 'Vše',
  });

  const { loading, error, data, refetch } = useQuery<ProceedingsResponse>(
    GET_ALL_PROCEEDINGS,
    {
      variables: {
        currentPage: currentPage,
        pageSize: PAGE_SIZE,
        sortOrder: sortOrder,
        filterProceedingNumber: filterData.proceedingNumber,
        filterDeceasedName: filterData.deceasedName,
        filterStartDate: filterData.startDate,
        filterPhaseId: filterData.phaseId,
        filterStatus: filterData.filterStatus,
      },
      fetchPolicy: 'network-only',
    },
  );

  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
  };

  const handleFilter = (filterData: FilterData) => {
    setFilterData(filterData);
    setCurrentPage(1); // Reset to the first page on filter change
  };

  useEffect(() => {
    refetch(); // Refetch data when sorting or filtering changes
  }, [currentPage, sortOrder, filterData, refetch]);

  return {
    loading,
    error,
    proceedings: data?.getAllProceedings.data || [],
    totalProceedings: data?.getAllProceedings.total || 0,
    currentPage,
    totalPages: Math.ceil((data?.getAllProceedings.total || 0) / PAGE_SIZE),
    setCurrentPage,
    sortOrder,
    toggleSortOrder,
    filterData,
    handleFilter,
    refetch,
  };
};
