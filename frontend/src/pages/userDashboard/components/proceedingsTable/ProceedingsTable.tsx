import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  SearchIcon,
  WarningIcon,
} from '@chakra-ui/icons';
import {
  Box,
  Center,
  Flex,
  Heading,
  IconButton,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { SubmitHandler } from 'react-hook-form';
import { z } from 'zod';

import {
  Form,
  InputField,
  PrimaryButton,
  SelectField,
} from '@frontend/components';
import { RouterNavButton } from '@frontend/components/navigation/atoms/RouterNavButton.tsx';
import { GET_ALL_PROCEEDINGS } from '@frontend/gql/proceedings/queries';
import { Routes } from '@frontend/routes.ts';
import { insertIdToUrl } from '@frontend/utils/util.tsx';

type Proceeding = {
  id: number;
  proceedingsNumber: string;
  startDate: string;
  phaseTitle: string;
  deceasedFirstName: string;
  deceasedLastName: string;
};

type FormFields = z.infer<typeof schema>;

const schema = z.object({
  proceedingNumber: z.string().optional(),
  proceedingFilter: z.enum(['Vše', 'Probíhající', 'Ukončeno']).optional(),
});

const PAGE_SIZE = 8;

export const ProceedingsTable: React.FC = () => {
  const [proceedings, setProceedings] = useState<Proceeding[]>([]);
  const [filteredProceedings, setFilteredProceedings] = useState<Proceeding[]>(
    [],
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortProcNumberOrder, setSortProcNumberOrder] = useState<
    'asc' | 'desc'
  >('desc');

  const { loading, error, data } = useQuery(GET_ALL_PROCEEDINGS);

  useEffect(() => {
    if (data && data.getAllProceedings) {
      setProceedings(data.getAllProceedings);
      setFilteredProceedings(data.getAllProceedings);
    }
  }, [data]);

  useEffect(() => {
    const sortedData = [...proceedings].sort((a, b) => {
      const numA = a.proceedingsNumber || '';
      const numB = b.proceedingsNumber || '';
      return sortProcNumberOrder === 'asc'
        ? numA.localeCompare(numB)
        : numB.localeCompare(numA);
    });
    setFilteredProceedings(sortedData);
    setCurrentPage(1);
  }, [proceedings, sortProcNumberOrder]);

  const toggleSortOrder = () => {
    setSortProcNumberOrder((prevOrder) =>
      prevOrder === 'asc' ? 'desc' : 'asc',
    );
  };

  const onSubmit: SubmitHandler<FormFields> = async (data: FormFields) => {
    const { proceedingNumber, proceedingFilter } = data;

    const filtered = proceedings.filter((proceeding) => {
      const matchesNumber = proceedingNumber
        ? proceeding.proceedingsNumber.includes(proceedingNumber)
        : true;
      const matchesPhase =
        proceedingFilter === 'Vše'
          ? true
          : proceeding.phaseTitle === proceedingFilter?.toLocaleLowerCase();

      return matchesNumber && matchesPhase;
    });

    setFilteredProceedings(filtered);
    setCurrentPage(1);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) =>
      Math.min(prevPage + 1, Math.ceil(filteredProceedings.length / PAGE_SIZE)),
    );
  };

  const totalPages = Math.ceil(filteredProceedings.length / PAGE_SIZE);
  const paginatedProceedings = filteredProceedings.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  return (
    <Form
      defaultValues={{
        proceedingNumber: '',
        proceedingFilter: 'Vše',
      }}
      onSubmit={onSubmit}
    >
      <Box p={8}>
        <Heading fontSize="2xl" fontWeight="bold" mb={4}>
          Seznam dědických řízení
        </Heading>
        <Box display="flex" mb={4} gap={4} alignItems="center">
          <InputField
            name="proceedingNumber"
            placeholder="Zadejte číslo dědického řízení"
            flex="1"
          />
          <SelectField name="proceedingFilter" width="150px">
            <option value="Vše">Vše</option>
            <option value="Probíhající">Probíhající</option>
            <option value="Ukončeno">Ukončeno</option>
          </SelectField>
          <PrimaryButton
            paddingX={8}
            leftIcon={<SearchIcon />}
            type="submit"
            disabled={loading}
          >
            Hledat
          </PrimaryButton>
        </Box>
        <Box borderWidth="1px" borderRadius="lg">
          <Table variant="simple" size="md">
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
                    {sortProcNumberOrder === 'asc' ? (
                      <ArrowUpIcon ml={2} />
                    ) : (
                      <ArrowDownIcon ml={2} />
                    )}
                  </Flex>
                </Th>
                <Th>Zůstavitel</Th>
                <Th>Zahájení řízení</Th>
                <Th>Stav</Th>
                <Th>Akce</Th>
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
              ) : paginatedProceedings.length > 0 ? (
                paginatedProceedings.map((proceeding) => (
                  <Tr
                    key={proceeding.id}
                    bg="white"
                    _hover={{ bg: 'goldenYellow.10' }}
                  >
                    <Td>{proceeding.proceedingsNumber}</Td>
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
                    <Td>{proceeding.phaseTitle}</Td>
                    <Td>
                      <RouterNavButton
                        to={insertIdToUrl(
                          Routes.proceedingOverview,
                          proceeding.id,
                        )}
                        size="sm"
                      >
                        Detail
                      </RouterNavButton>
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
        </Box>
        <Flex justifyContent="space-between" alignItems="center" mt={4}>
          <Text fontSize="md" color="gray.600">
            Záznamů: {filteredProceedings.length}
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
    </Form>
  );
};

export default ProceedingsTable;
