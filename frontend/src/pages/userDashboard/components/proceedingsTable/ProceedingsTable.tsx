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

import { PrimaryButton } from '@frontend/components/buttons';
import { DeceasedPersonFormFields } from '@frontend/components/forms/deceasedPersonForm/DeceasedPersonForm.tsx';
import { OrdersIcon } from '@frontend/components/table/OrdersIcon.tsx';
import { ProceedingsTableBody } from '@frontend/pages/userDashboard/components/proceedingsTable/ProceedingsTableBody.tsx';
import { useProceedings } from '@frontend/pages/userDashboard/hooks/useProceedings.ts';

type ProceedingsTableProps = {
  onEditProceeding?: (id: number, data: DeceasedPersonFormFields) => void;
  onDeleteProceeding?: (id: number) => void;
};

export const ProceedingsTable: React.FC<ProceedingsTableProps> = ({
  onEditProceeding,
  onDeleteProceeding,
}) => {
  const {
    loading,
    error,
    proceedings,
    totalProceedings,
    currentPage,
    totalPages,
    setCurrentPage,
    sortOrder,
    toggleSortOrder,
    filterData,
    handleFilter,
  } = useProceedings();

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
          Seznam dědických řízení
        </Heading>
        <Flex gap={4} mt={4} direction={{ base: 'column', sm: 'row' }}>
          {['Vše', 'Probíhající', 'Ukončené'].map((status) => (
            <PrimaryButton
              key={status}
              py={2}
              px={8}
              size="sm"
              borderRadius="full"
              variant={filterData.filterStatus === status ? 'solid' : 'outline'}
              onClick={() =>
                handleFilter({
                  ...filterData,
                  filterStatus: status,
                })
              }
            >
              {status}
            </PrimaryButton>
          ))}
        </Flex>
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
                      onClick={toggleSortOrder}
                      _hover={{ color: 'blue.600' }}
                    >
                      Číslo řízení
                      <OrdersIcon sortOrder={sortOrder} />
                    </Flex>
                    <Input
                      mt={2}
                      borderRadius="md"
                      name="proceedingNumber"
                      size="sm"
                      placeholder="Hledat číslo řízení"
                      flex="1"
                      onChange={(e) =>
                        handleFilter({
                          ...filterData,
                          proceedingNumber: e.target.value,
                        })
                      }
                    />
                  </Th>
                  <Th verticalAlign="top">
                    <Flex direction="column">
                      Zůstavitel
                      <Input
                        mt={2}
                        py={2}
                        borderRadius="md"
                        name="deceasedName"
                        size="sm"
                        placeholder="Hledat jméno zůstavitele"
                        flex="1"
                        onChange={(e) =>
                          handleFilter({
                            ...filterData,
                            deceasedName: e.target.value,
                          })
                        }
                      />
                    </Flex>
                  </Th>
                  <Th verticalAlign="top">
                    <Flex direction="column">
                      Zahájení řízení
                      <Input
                        mt={2}
                        py={2}
                        type="date"
                        borderRadius="md"
                        name="startDate"
                        size="sm"
                        placeholder="Hledat datum zahájení řízení"
                        flex="1"
                        onChange={(e) =>
                          handleFilter({
                            ...filterData,
                            startDate: e.target.value,
                          })
                        }
                      />
                    </Flex>
                  </Th>
                  <Th verticalAlign="top">
                    <Flex direction="column">
                      Aktuální fáze
                      <Select
                        mt={2}
                        height={9}
                        placeholder="Hledat aktuální fázi"
                        borderRadius="md"
                        name="phaseId"
                        size="sm"
                        flex="1"
                        onChange={(e) =>
                          handleFilter({
                            ...filterData,
                            phaseId: Number(e.target.value),
                          })
                        }
                      >
                        <option value="1">Úvodní fáze</option>
                        <option value="2">Předběžné šetření</option>
                        <option value="3">Pozůstalostní řízení</option>
                        <option value="4">Ukončené</option>
                      </Select>
                    </Flex>
                  </Th>
                  <Th verticalAlign="top">Akce</Th>
                </Tr>
              </Thead>
              <Tbody>
                <ProceedingsTableBody
                  loading={loading}
                  error={error}
                  proceedings={proceedings}
                  onEditProceeding={onEditProceeding}
                  onDeleteProceeding={onDeleteProceeding}
                />
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
        <Flex justifyContent="space-between" alignItems="center" mt={4}>
          <Text fontSize="md" color="gray.600">
            Záznamů: {totalProceedings}
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

export default ProceedingsTable;
