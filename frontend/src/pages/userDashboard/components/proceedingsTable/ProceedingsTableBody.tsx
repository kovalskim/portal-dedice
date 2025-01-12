import React from 'react';
import { ApolloError } from '@apollo/client';
import { DeleteIcon, EditIcon, WarningIcon } from '@chakra-ui/icons';
import {
  Badge,
  Center,
  Flex,
  IconButton,
  Spinner,
  Td,
  Text,
  Tr,
} from '@chakra-ui/react';

import { DeceasedPersonFormFields } from '@frontend/components/forms/deceasedPersonForm/DeceasedPersonForm.tsx';
import { RouterNavButton } from '@frontend/components/navigation/atoms/RouterNavButton.tsx';
import { Role, useAuth } from '@frontend/context/auth/auth-core.tsx';
import { Proceeding } from '@frontend/gql/proceedings/queries.ts';
import { Routes } from '@frontend/routes/routes.ts';
import { formatDate, insertIdToUrl } from '@frontend/utils/generalUtil.ts';

type ProceedingsTableBodyProps = {
  loading: boolean;
  error: ApolloError | undefined;
  proceedings: Proceeding[];
  onEditProceeding?: (id: number, data: DeceasedPersonFormFields) => void;
  onDeleteProceeding?: (id: number) => void;
};

export const ProceedingsTableBody: React.FC<ProceedingsTableBodyProps> = ({
  loading,
  error,
  proceedings,
  onEditProceeding,
  onDeleteProceeding,
}) => {
  const { role } = useAuth();

  if (loading) {
    return (
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
    );
  }

  if (error) {
    return (
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
    );
  }

  if (proceedings.length > 0) {
    return proceedings.map((proceeding) => (
      <Tr key={proceeding.id} bg="white" _hover={{ bg: 'goldenYellow.10' }}>
        <Td>{proceeding.proceedingNumber}</Td>
        <Td>{`${proceeding.deceasedFirstName} ${proceeding.deceasedLastName}`}</Td>
        <Td>{formatDate(proceeding.startDate)}</Td>
        <Td>{proceeding.phaseTitle ?? ''}</Td>
        <Td>
          <Flex direction="row" gap={2}>
            {proceeding.isLoggedUserApprovedParticipantOrNotary ||
            role === Role.ADMIN ? (
              <RouterNavButton
                to={insertIdToUrl(Routes.proceedingOverview, proceeding.id)}
                size="sm"
              >
                Detail
              </RouterNavButton>
            ) : (
              <Badge
                variant="subtle"
                colorScheme="goldenYellow"
                px={4}
                borderRadius="xl"
              >
                Vyčkejte na schválení žádosti
              </Badge>
            )}

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
                      birthdate: proceeding.deceasedDateOfBirth.split('T')[0],
                      deathdate:
                        proceeding.deceasedDateOfDeath?.split('T')[0] || '',
                      streetWithNumber: proceeding.deceasedStreetWithNumber,
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
                  onClick={() => onDeleteProceeding?.(proceeding.id)}
                />
              </>
            )}
          </Flex>
        </Td>
      </Tr>
    ));
  }

  return (
    <Tr>
      <Td colSpan={5} textAlign="center" py={10}>
        <Text fontSize="lg" color="gray.500">
          Žádné dědické řízení nebylo nalezeno
        </Text>
      </Td>
    </Tr>
  );
};
