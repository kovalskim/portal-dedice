import React from 'react';
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DeleteIcon,
  EditIcon,
  WarningIcon,
} from '@chakra-ui/icons';
import {
  Box,
  Center,
  Flex,
  Heading,
  IconButton,
  Input,
  Select,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';

import { PrimaryButton } from '@frontend/components';
import { DeceasedPersonFormFields } from '@frontend/components/forms/deceasedPersonForm/DeceasedPersonForm.tsx';
import { RouterNavButton } from '@frontend/components/navigation/atoms/RouterNavButton.tsx';
import { useAuth } from '@frontend/context/auth';
import { Role } from '@frontend/context/auth/auth-core';
import { useProceedings } from '@frontend/pages/userDashboard/hooks/useProceedings.ts';
import { Routes } from '@frontend/routes/routes.ts';
import { insertIdToUrl } from '@frontend/utils/util.tsx';

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

  const { role } = useAuth();

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
                      {sortOrder === 'asc' ? (
                        <ArrowUpIcon ml={2} />
                      ) : (
                        <ArrowDownIcon ml={2} />
                      )}
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
                {loading ? (
                  <Tr>
                    <Td colSpan={5} textAlign="center" py={10}>
                      <Center>
                        <Spinner size="lg" color="yellow.500" />
                        <Text ml={4} fontSize="lg" color="gray.500">
                          Načítání dat...
                        </Text>
                      </Center>
                    </Td>
                  </Tr>
                ) : error ? (
                  <Tr>
                    <Td colSpan={5} textAlign="center" py={10}>
                      <Center>
                        <WarningIcon color="red.500" boxSize={6} mr={2} />
                        <Text fontSize="lg" color="red.500">
                          Došlo k chybě při načítání dat.
                        </Text>
                      </Center>
                    </Td>
                  </Tr>
                ) : proceedings.length > 0 ? (
                  proceedings.map((proceeding) => (
                    <Tr
                      key={proceeding.id}
                      bg="white"
                      _hover={{ bg: 'goldenYellow.10' }}
                    >
                      <Td>{proceeding.proceedingNumber}</Td>
                      <Td>{`${proceeding.deceasedFirstName} ${proceeding.deceasedLastName}`}</Td>
                      <Td>
                        {new Date(proceeding.startDate).toLocaleDateString(
                          'cs-CZ',
                          {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                          },
                        )}
                      </Td>
                      <Td>{proceeding.phaseTitle ?? ''}</Td>
                      <Td>
                        <Flex direction="row" gap={2}>
                          <RouterNavButton
                            to={insertIdToUrl(
                              Routes.proceedingOverview,
                              proceeding.id,
                            )}
                            size="sm"
                          >
                            Detail
                          </RouterNavButton>

                          {role === Role.NOTARY && (
                            <>
                              <IconButton
                                aria-label="Edit proceeding"
                                icon={<EditIcon />}
                                size="sm"
                                ml={1}
                                onClick={() =>
                                  onEditProceeding?.(proceeding.id, {
                                    sex: proceeding.deceasedSex,
                                    firstname: proceeding.deceasedFirstName,
                                    lastname: proceeding.deceasedLastName,
                                    birthdate:
                                      proceeding.deceasedDateOfBirth.split(
                                        'T',
                                      )[0],
                                    deathdate:
                                      proceeding.deceasedDateOfDeath?.split(
                                        'T',
                                      )[0] || '',
                                    streetWithNumber:
                                      proceeding.deceasedStreetWithNumber,
                                    city: proceeding.deceasedCity,
                                    district: proceeding.deceasedDistrict,
                                    postalCode: proceeding.deceasedPostalCode,
                                  })
                                }
                              />

                              <IconButton
                                aria-label="Delete proceeding"
                                colorScheme="red"
                                icon={<DeleteIcon />}
                                size="sm"
                                ml={1}
                                onClick={() =>
                                  onDeleteProceeding?.(proceeding.id)
                                }
                              />
                            </>
                          )}
                        </Flex>
                      </Td>
                    </Tr>
                  ))
                ) : (
                  <Tr>
                    <Td colSpan={5} textAlign="center" py={10}>
                      <Text fontSize="lg" color="gray.500">
                        Žádné dědické řízení nebylo nalezeno
                      </Text>
                    </Td>
                  </Tr>
                )}
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
              isDisabled={currentPage === totalPages}
              _disabled={{ cursor: 'default', opacity: 0.5 }}
            />
          </Box>
        </Flex>
      </Box>
    </>
  );
};

export default ProceedingsTable;
