import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import { Box } from '@chakra-ui/layout';
import { Heading } from '@chakra-ui/react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { PrimaryButton, SecondaryButton } from '@frontend/components/buttons';
import { NewParticipantInput } from '@frontend/components/forms/addParticipants/NewParticipantInput.tsx';

export const NewParticipants = () => {
  const { control } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'participants',
  });

  return (
    <Box>
      <Heading fontSize="md" mb={4}>
        Informace o účastnících řízení
      </Heading>
      {fields.map((field, index) => (
        <Box key={field.id} borderWidth="1px" borderRadius="lg" p="4" mb={4}>
          <NewParticipantInput index={index} />
          <SecondaryButton
            mt={2}
            size="sm"
            onClick={() => remove(index)}
            isDisabled={fields.length === 1}
          >
            <DeleteIcon fontSize="xs" mr={2} />
            Odebrat
          </SecondaryButton>
        </Box>
      ))}
      <PrimaryButton
        variant="outline"
        size="sm"
        onClick={() => append({ firstname: '', lastname: '', email: '' })}
      >
        <AddIcon fontSize="xs" mr={1} />
        Přidat dalšího účastníka
      </PrimaryButton>
    </Box>
  );
};
