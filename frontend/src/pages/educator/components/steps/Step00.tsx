import { Box, Card, Heading, Text } from '@chakra-ui/react';

import { PrimaryButton } from '@frontend/components';
import { useEducatorState } from '@frontend/hooks/useEducatorState';

export const Step00 = () => {
  const { incrementState } = useEducatorState();

  return (
    <Card
      width="100%"
      minHeight="500px"
      maxW={{
        base: '90%',
        md: '80%',
        lg: '70%',
      }}
      p={0}
    >
      <Box textAlign="center" m="auto">
        <Heading as="h1" size="md" textAlign="center">
          Interaktivní nachytřovadlo
        </Heading>
        <Text px={12} py={12}>
          Interaktivní nachytřovadlo, které je součástí Portálu dědice, vám
          jednoduchým a interaktivním způsobem poskytne odpovědi na vaše otázky
          týkající se dědického řízení a poskytne vám dodatečné informace
          potřebné pro nadcházející komunikaci s notářem.
        </Text>
        <PrimaryButton onClick={incrementState}>
          Spustit nachytřovadlo
        </PrimaryButton>
      </Box>
    </Card>
  );
};
