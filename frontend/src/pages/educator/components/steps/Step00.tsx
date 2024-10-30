import { Box, Card, Flex, Heading, Text } from '@chakra-ui/react';

import { PrimaryButton, SecondaryButton } from '@frontend/components';
import { useEducatorState } from '@frontend/hooks/useEducatorState';
import { useEducatorStorage } from '@frontend/hooks/useEducatorStorage';

export const Step00 = () => {
  const { incrementState } = useEducatorState();
  const { resetStorage, storage } = useEducatorStorage();

  return (
    <Card
      width="100%"
      minHeight="500px"
      maxW={{
        base: '90%',
        lg: '80%',
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
        {!storage.deceasedPersonFormData && !storage.identifiedNotary ? (
          <PrimaryButton
            onClick={() => {
              incrementState();
            }}
          >
            Spustit nachytřovadlo
          </PrimaryButton>
        ) : (
          <Flex flexDirection="column" gap={4} alignItems="center">
            <PrimaryButton
              onClick={() => {
                incrementState();
              }}
              minW="250px"
            >
              Pokračovat kde jsem skončil
            </PrimaryButton>
            <SecondaryButton
              onClick={() => {
                resetStorage();
                incrementState();
              }}
              minW="250px"
            >
              Začít znovu
            </SecondaryButton>
          </Flex>
        )}
      </Box>
    </Card>
  );
};
