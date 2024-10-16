import { Flex, Text } from '@chakra-ui/react';

type SidebarProceedingsInfoProps = {
  id: string;
};

export const SidebarProceedingsInfo = ({ id }: SidebarProceedingsInfoProps) => {
  // TODO: get data from API

  return (
    <Flex direction="column">
      <Text fontSize="lg" fontWeight="bold" pt={{ base: 2, md: 10 }}>
        Dědické řízení č. {id}
      </Text>
      <Text fontWeight="bold" pt="2">
        Zůstavitel: Jan Novák
      </Text>
      <Text fontWeight="bold">Zahájení řízení: 1. 5. 2024</Text>
    </Flex>
  );
};
