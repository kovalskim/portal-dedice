import { Badge, Flex, Text } from '@chakra-ui/react';

import { Proceeding } from '@frontend/gql/proceedings/queries.ts';

type SidebarProceedingsInfoProps = {
  proceeding: Proceeding;
};

export const SidebarProceedingsInfo = ({
  proceeding,
}: SidebarProceedingsInfoProps) => {
  return (
    <>
      <Flex direction="column" pt={{ base: 2, md: 8 }} alignItems="flex-start">
        <Text fontSize="xl" fontWeight="bold">
          Dědické řízení: {proceeding.proceedingsNumber || 'N/A'}
        </Text>
        <Badge
          mt={2}
          px={4}
          fontSize="sm"
          borderRadius="lg"
          variant="subtle"
          textTransform="capitalize"
          colorScheme={proceeding.phaseId === 4 ? 'red' : 'green'}
        >
          {proceeding.phaseId === 4 ? 'Ukončené' : 'Probíhající'}
        </Badge>
        <Text fontWeight="medium" pt={2}>
          Přidělený notář:{' '}
          {`${proceeding.notary?.beforeTitle} ${proceeding.notary?.firstname} ${proceeding.notary?.lastname} ${proceeding.notary?.afterTitle && ','} ${proceeding.notary?.afterTitle}`}
        </Text>
        <Text fontWeight="medium" pt={2}>
          Zůstavitel:&nbsp;
          {`${proceeding.deceasedFirstName} ${proceeding.deceasedLastName}`}
        </Text>
        <Text fontWeight="medium" pt={2}>
          Zahájení řízení:{' '}
          {new Date(proceeding.startDate || '').toLocaleDateString()}
        </Text>
      </Flex>
    </>
  );
};
