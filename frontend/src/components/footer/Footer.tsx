import { FC } from 'react';
import { Container, Flex, Link, Text } from '@chakra-ui/react';

export const Footer: FC = () => {
  return (
    <footer>
      <Container maxW="container.xl">
        <Flex
          bg="white"
          p="4"
          direction="column"
          alignItems="center"
          justify="center"
          gap="1"
        >
          <Text fontSize="xs">© 2024 by Team 5</Text>
          <Text fontSize="xs" color="gray.500">
            <Link href="https://www.nkcr.cz/" isExternal>
              Notářská komora ČR
            </Link>{' '}
            |{' '}
            <Link href="https://www.vse.cz/" isExternal>
              VŠE
            </Link>
          </Text>
        </Flex>
      </Container>
    </footer>
  );
};
