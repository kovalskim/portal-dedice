import { Flex } from '@chakra-ui/react';

import { InputField } from '@frontend/components/forms/fields/InputField.tsx';

type NewParticipantInputProps = {
  index?: number | null;
};

export const NewParticipantInput = ({
  index = null,
}: NewParticipantInputProps) => {
  return (
    <Flex
      direction={{
        base: 'column',
        md: 'row',
      }}
      gap={3}
    >
      <InputField
        name={index === null ? 'firstname' : `participants.${index}.firstname`}
        label="Jméno"
        placeholder="Zadejte jméno"
      />
      <InputField
        name={index === null ? 'lastname' : `participants.${index}.lastname`}
        label="Příjmení"
        placeholder="Zadejte příjmení "
      />
      <InputField
        name={index === null ? 'email' : `participants.${index}.email`}
        label="Email"
        placeholder="Zadejte email "
        type="email"
      />
    </Flex>
  );
};
