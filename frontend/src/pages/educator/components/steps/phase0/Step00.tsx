import { Card, Container, Flex, Heading, Image, Text } from '@chakra-ui/react';

import { PrimaryButton, SecondaryButton } from '@frontend/components';
import { useEducatorState } from '@frontend/hooks/useEducatorState.ts';
import { useEducatorStorage } from '@frontend/hooks/useEducatorStorage.ts';

export const Step00 = () => {
  const { incrementState } = useEducatorState();
  const { resetStorage, storage, getResult } = useEducatorStorage();

  return (
    <Card
      width="100%"
      minHeight="600px"
      maxW={{
        base: '90%',
        lg: '80%',
      }}
      py={8}
    >
      <Flex direction="column" alignItems="center" textAlign="center" m="auto">
        <Image src="/education.png" w="350px" />
        <Heading size="md" textAlign="center">
          Dědické nachytřovadlo
        </Heading>
        <Container maxW="container.md">
          <Text px={12} py={8}>
            Dědické nachytřovadlo, které je součástí Portálu dědice, vám
            jednoduchým a interaktivním způsobem poskytne odpovědi na vaše
            otázky týkající se dědického řízení a poskytne vám dodatečné
            informace potřebné pro nadcházející komunikaci s notářem.
          </Text>
          {!storage.deceasedPersonFormData &&
          !storage.identifiedNotary &&
          !getResult() ? (
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
                Pokračovat, kde jsem skončil/a
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
        </Container>
      </Flex>
    </Card>
  );
};
