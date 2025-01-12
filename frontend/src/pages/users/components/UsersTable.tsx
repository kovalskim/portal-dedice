import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import {
  Box,
  Flex,
  Heading,
  IconButton,
  Input,
  Select,
  Table,
  TableContainer,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';

import { OrdersIcon } from '@frontend/components/table/OrdersIcon.tsx';
import { UsersTableBody } from '@frontend/pages/users/components/UsersTableBody.tsx';
import { useUsers } from '@frontend/pages/users/hooks/useUsers.ts';

type UsersTableProps = {
  setBanModalOpenState: (
    userId: number,
    state: 'close' | 'ban' | 'unban',
  ) => void;
};

export const UsersTable: React.FC<UsersTableProps> = ({
  setBanModalOpenState,
}) => {
  const {
    loading,
    error,
    users,
    totalUsers,
    currentPage,
    totalPages,
    setCurrentPage,
    sortByFirstnameOrder,
    toggleSortByFirstnameOrder,
    sortByLastnameOrder,
    toggleSortByLastnameOrder,
    sortByEmailOrder,
    toggleSortByEmailOrder,
    filterData,
    handleFilter,
  } = useUsers();

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  return (
    <>
      <Box
        p={{
          base: 4,
          md: 8,
        }}
        maxW={{ base: 'sm', md: '100%' }}
      >
        <Heading fontSize="2xl" fontWeight="bold" mb={4}>
          Seznam uživatelů aplikace
        </Heading>
        <Box overflowX="auto">
          <TableContainer
            borderWidth="1px"
            borderRadius="lg"
            mt={6}
            overflow="auto hidden"
            maxW="100%"
            whiteSpace="nowrap"
            display="block"
          >
            <Table variant="simple" size={{ base: 'sm', md: 'md' }} mt={2}>
              <Thead>
                <Tr>
                  <Th>
                    <Flex
                      alignItems="center"
                      cursor="pointer"
                      onClick={toggleSortByFirstnameOrder}
                      _hover={{ color: 'blue.600' }}
                    >
                      Jméno
                      <OrdersIcon sortOrder={sortByFirstnameOrder} />
                    </Flex>
                    <Input
                      mt={2}
                      borderRadius="md"
                      name="firstname"
                      size="sm"
                      placeholder="Hledat podle jména uživatele"
                      flex="1"
                      onChange={(e) =>
                        handleFilter({
                          ...filterData,
                          firstname: e.target.value,
                        })
                      }
                    />
                  </Th>
                  <Th verticalAlign="top">
                    <Flex
                      alignItems="center"
                      cursor="pointer"
                      onClick={toggleSortByLastnameOrder}
                      _hover={{ color: 'blue.600' }}
                    >
                      Příjmení
                      <OrdersIcon sortOrder={sortByLastnameOrder} />
                    </Flex>
                    <Input
                      mt={2}
                      borderRadius="md"
                      name="lastname"
                      size="sm"
                      placeholder="Hledat podle příjmení uživatele"
                      flex="1"
                      onChange={(e) =>
                        handleFilter({
                          ...filterData,
                          lastname: e.target.value,
                        })
                      }
                    />
                  </Th>
                  <Th verticalAlign="top">
                    <Flex
                      alignItems="center"
                      cursor="pointer"
                      onClick={toggleSortByEmailOrder}
                      _hover={{ color: 'blue.600' }}
                    >
                      E-mail
                      <OrdersIcon sortOrder={sortByEmailOrder} />
                    </Flex>
                    <Input
                      mt={2}
                      borderRadius="md"
                      name="email"
                      size="sm"
                      placeholder="Hledat podle e-mailu uživatele"
                      flex="1"
                      onChange={(e) =>
                        handleFilter({
                          ...filterData,
                          email: e.target.value,
                        })
                      }
                    />
                  </Th>
                  <Th verticalAlign="top">
                    <Flex direction="column">
                      Role
                      <Select
                        mt={2}
                        height={9}
                        placeholder="Hledat podle role uživatele"
                        borderRadius="md"
                        name="roleId"
                        size="sm"
                        flex="1"
                        onChange={(e) =>
                          handleFilter({
                            ...filterData,
                            roleId: Number(e.target.value),
                          })
                        }
                      >
                        <option value="1">Administrátor</option>
                        <option value="2">Uživatel</option>
                        <option value="3">Notář</option>
                      </Select>
                    </Flex>
                  </Th>
                  <Th verticalAlign="top">
                    <Flex direction="column">
                      Ověření
                      <Select
                        mt={2}
                        height={9}
                        placeholder="Hledat podle oveření uživatele"
                        borderRadius="md"
                        name="roleId"
                        size="sm"
                        flex="1"
                        onChange={(e) =>
                          handleFilter({
                            ...filterData,
                            isVerified: e.target.value
                              ? Number(e.target.value)
                              : null,
                          })
                        }
                      >
                        <option value="1">Ověřený uživatel</option>
                        <option value="0">Neověřený uživatel</option>
                      </Select>
                    </Flex>
                  </Th>
                  <Th verticalAlign="top">
                    <Flex direction="column">
                      Blokace
                      <Select
                        mt={2}
                        height={9}
                        placeholder="Hledat podle oveření uživatele"
                        borderRadius="md"
                        name="roleId"
                        size="sm"
                        flex="1"
                        onChange={(e) =>
                          handleFilter({
                            ...filterData,
                            isBanned: e.target.value
                              ? Number(e.target.value)
                              : null,
                          })
                        }
                      >
                        <option value="1">Zablokovaný uživatel</option>
                        <option value="0">Nezablokovaný uživatel</option>
                      </Select>
                    </Flex>
                  </Th>
                  <Th verticalAlign="top">Akce</Th>
                </Tr>
              </Thead>
              <Tbody>
                <UsersTableBody
                  loading={loading}
                  error={error}
                  users={users}
                  setBanModalOpenState={setBanModalOpenState}
                />
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
        <Flex justifyContent="space-between" alignItems="center" mt={4}>
          <Text fontSize="md" color="gray.600">
            Záznamů: {totalUsers}
          </Text>
          <Box display="flex" alignItems="center" gap={2}>
            <IconButton
              icon={<ChevronLeftIcon />}
              aria-label="Previous page"
              onClick={handlePreviousPage}
              variant="ghost"
              isDisabled={currentPage === 1}
              _disabled={{ cursor: 'default', opacity: 0.5 }}
            />
            <Text>
              {totalPages > 0 ? currentPage : 0} / {totalPages}
            </Text>
            <IconButton
              icon={<ChevronRightIcon />}
              aria-label="Next page"
              onClick={handleNextPage}
              variant="ghost"
              isDisabled={totalPages === 0}
              _disabled={{ cursor: 'default', opacity: 0.5 }}
            />
          </Box>
        </Flex>
      </Box>
    </>
  );
};

export default UsersTable;
