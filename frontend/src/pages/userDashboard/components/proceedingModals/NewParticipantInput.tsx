import { Flex } from '@chakra-ui/react';

import { InputField } from '@frontend/components/forms/fields/InputField';

export const NewParticipantInput = () => {
  return (
    <Flex direction="column" gap={4}>
      <Flex
        direction={{
          base: 'column',
          md: 'row',
        }}
        gap="5"
      >
        <InputField
          name="firstname"
          label="Jméno"
          placeholder="Zadejte jméno účastníka"
        />
        <InputField
          name="lastname"
          label="Příjmení"
          placeholder="Zadejte příjmení účastníka"
        />
      </Flex>
      <Flex
        direction={{
          base: 'column',
          md: 'row',
        }}
        mb="6"
        gap="5"
      >
        <InputField
          name="email"
          label="Email"
          placeholder="Zadejte email účastníka"
          type="email"
        />
      </Flex>
    </Flex>
  );
};
