import { FC } from 'react';
import { Grid, GridItem, Heading } from '@chakra-ui/react';
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
        <Grid gap={4} mb={10}>
          <GridItem>
            <InputField
              name="proceedingsNumber"
              label="Číslo dědického řízení"
              placeholder="Zadejte číslo dědického řízení"
            />
          </GridItem>
          <GridItem>
            <InputField
              name="firstname"
              label="Jméno zůstavitele"
              placeholder="Zadejte jméno zůstavitele"
            />
          </GridItem>
          <GridItem>
            <InputField
              name="lastname"
              label="Příjmení zůstavitele"
              placeholder="Zadejte příjmení zůstavitele"
            />
          </GridItem>
          <GridItem>
            <InputField
              name="deathdate"
              label="Datum úmrtí zůstavitele"
              placeholder="Zadejte datum úmrtí zůstavitele"
              type="date"
            />
          </GridItem>
        </Grid>
      </Form>
    </>
  );
};
