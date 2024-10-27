import { FC } from 'react';
import { Flex, Grid, GridItem, Heading } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod/src/zod.js';
import { SubmitHandler } from 'react-hook-form';
import { z } from 'zod';

import { Form, InputField } from '@frontend/components/forms';

const schema = z.object({
  proceedingsNumber: z.string().min(1, { message: 'Povinné pole' }),
  firstname: z.string().min(1, { message: 'Povinné pole' }),
  lastname: z.string().min(1, { message: 'Povinné pole' }),
  deathdate: z.string().min(1, { message: 'Povinné pole' }),
});

export type GeneralInfoFormFields = z.infer<typeof schema>;

interface GeneralInfoFormProps {
  id: string;
  onSubmit: SubmitHandler<GeneralInfoFormFields>;
}

export const GeneralInfoForm: FC<GeneralInfoFormProps> = ({ id, onSubmit }) => {
  return (
    <>
      <Heading as="h4" size="sm" mb={4}>
        Obecné informace
      </Heading>
      <Form
        id={id}
        defaultValues={{
          proceedingsNumber: '',
          firstname: '',
          lastname: '',
          deathdate: '',
        }}
        resolver={zodResolver(schema)}
        onSubmit={onSubmit}
      >
        <Flex gap={4} mb={10} direction="column">
          <Flex gap={4} direction={{ base: 'column', md: 'row' }}>
            <InputField
              name="proceedingsNumber"
              label="Číslo dědického řízení"
              placeholder="Zadejte číslo dědického řízení"
            />
            <InputField
              name="deathdate"
              label="Datum úmrtí zůstavitele"
              placeholder="Zadejte datum úmrtí zůstavitele"
              type="date"
            />
          </Flex>
          <Flex gap={4} direction={{ base: 'column', md: 'row' }}>
            <InputField
              name="firstname"
              label="Jméno zůstavitele"
              placeholder="Zadejte jméno zůstavitele"
            />
            <InputField
              name="lastname"
              label="Příjmení zůstavitele"
              placeholder="Zadejte příjmení zůstavitele"
            />
          </Flex>
        </Flex>
      </Form>
    </>
  );
};
