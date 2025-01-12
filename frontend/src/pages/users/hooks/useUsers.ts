import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';

import { GET_ALL_USERS, UsersResponse } from '@frontend/gql/user/queries.ts';
import { getNextOrderValue } from '@frontend/utils/generalUtil.ts';

const PAGE_SIZE = 5;

type FilterData = {
  firstname: string;
  lastname: string;
  email: string;
  roleId: number;
  isVerified: number | null;
  isBanned: number | null;
};

export const useUsers = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const [sortByFirstnameOrder, setSortByFirstNameOrder] = useState<
    'asc' | 'desc' | 'default'
  >('default');
  const [sortByLastnameOrder, setSortByLastnameOrder] = useState<
    'asc' | 'desc' | 'default'
  >('default');
  const [sortByEmailOrder, setSortByEmailOrder] = useState<
    'asc' | 'desc' | 'default'
  >('default');

  const [filterData, setFilterData] = useState<FilterData>({
    firstname: '',
    lastname: '',
    email: '',
    roleId: 0,
    isVerified: null,
    isBanned: null,
  });

  const { loading, error, data, refetch } = useQuery<UsersResponse>(
    GET_ALL_USERS,
    {
      variables: {
        currentPage: currentPage,
        pageSize: PAGE_SIZE,
        sortByFirstnameOrder: sortByFirstnameOrder,
        sortByLastnameOrder: sortByLastnameOrder,
        sortByEmailOrder: sortByEmailOrder,
        filterFirstname: filterData.firstname,
        filterLastname: filterData.lastname,
        filterEmail: filterData.email,
        filterRoleId: filterData.roleId,
        filterIsVerified: filterData.isVerified,
        filterIsBanned: filterData.isBanned,
      },
      fetchPolicy: 'network-only',
    },
  );

  const toggleSortByFirstnameOrder = () => {
    setSortByFirstNameOrder((prevOrder) => getNextOrderValue(prevOrder));
  };

  const toggleSortByLastnameOrder = () => {
    setSortByLastnameOrder((prevOrder) => getNextOrderValue(prevOrder));
  };

  const toggleSortByEmailOrder = () => {
    setSortByEmailOrder((prevOrder) => getNextOrderValue(prevOrder));
  };

  const handleFilter = (filterData: FilterData) => {
    setFilterData(filterData);
    setCurrentPage(1); // Reset to the first page on filter change
  };

  useEffect(() => {
    refetch(); // Refetch data when sorting or filtering changes
  }, [
    currentPage,
    sortByFirstnameOrder,
    sortByLastnameOrder,
    sortByEmailOrder,
    filterData,
    refetch,
  ]);

  return {
    loading,
    error,
    users: data?.users.data || [],
    totalUsers: data?.users.total || 0,
    currentPage,
    totalPages: Math.ceil((data?.users.total || 0) / PAGE_SIZE),
    setCurrentPage,
    sortByFirstnameOrder,
    toggleSortByFirstnameOrder,
    sortByLastnameOrder,
    toggleSortByLastnameOrder,
    sortByEmailOrder,
    toggleSortByEmailOrder,
    filterData,
    handleFilter,
  };
};
