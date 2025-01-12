import React from 'react';
import { ApolloError } from '@apollo/client';
import { CheckIcon, CloseIcon, WarningIcon } from '@chakra-ui/icons';
import {
  Badge,
  Button,
  Center,
  Icon,
  Spinner,
  Td,
  Text,
  Tr,
} from '@chakra-ui/react';

import { theme } from '@frontend/components/design-system';
import { User } from '@frontend/gql/user/types.ts';

type UsersTableBodyProps = {
  loading: boolean;
  error: ApolloError | undefined;
  users: User[];
  setBanModalOpenState: (
    userId: number,
    state: 'close' | 'ban' | 'unban',
  ) => void;
};

export const UsersTableBody: React.FC<UsersTableBodyProps> = ({
  loading,
  error,
  users,
  setBanModalOpenState,
}) => {
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

  if (users.length > 0) {
    return users.map((user) => (
      <Tr key={user.id} bg="white" _hover={{ bg: 'goldenYellow.10' }}>
        <Td>{user.firstname}</Td>
        <Td>{user.lastname}</Td>
        <Td>{user.email}</Td>
        <Td>{user.role.description}</Td>
        <Td>
          {user.isVerified ? (
            <Icon
              as={CheckIcon}
              boxSize={5}
              color={theme.colors.goldenYellow[700]}
            />
          ) : (
            <Icon
              as={CloseIcon}
              boxSize={5}
              color={theme.colors.goldenYellow[700]}
            />
          )}
        </Td>
        <Td>
          {user.isBanned ? (
            <Badge colorScheme="red">Zablokovaný</Badge>
          ) : (
            <Badge colorScheme="green">Odblokovaný</Badge>
          )}
        </Td>
        <Td>
          {user.isBanned ? (
            <Button
              size="sm"
              colorScheme="green"
              onClick={() => setBanModalOpenState(Number(user.id), 'unban')}
            >
              Odblokovat
            </Button>
          ) : (
            <Button
              size="sm"
              colorScheme="red"
              onClick={() => setBanModalOpenState(Number(user.id), 'ban')}
            >
              Zablokovat
            </Button>
          )}
        </Td>
      </Tr>
    ));
  }

  return (
    <Tr>
      <Td colSpan={5} textAlign="center" py={10}>
        <Text fontSize="lg" color="gray.500">
          Žádní uživatelé nebyli nalezeni.
        </Text>
      </Td>
    </Tr>
  );
};
