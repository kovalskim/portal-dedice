import { Flex, Radio } from '@chakra-ui/react';
import { SubmitHandler } from 'react-hook-form';
import { z } from 'zod';

import { Form, InputField, RadioGroupField, zod } from '@frontend/components';
import { zodResolver } from '@frontend/components/forms';
import { useEducatorStorage } from '@frontend/hooks/useEducatorStorage.ts';
import { AutocompleteAddress } from '@frontend/pages/educator/components/notary-identification/AutocompleteAddress.tsx';
import { useValidDistricts } from '@frontend/pages/educator/components/notary-identification/useValidDistricts.ts';

const postalCodeRegex = new RegExp('^\\d{3}\\s\\d{2}$');

const baseDeceasedInfoSchema = zod.object({
  sex: zod.string().min(1, { message: 'Povinné pole' }),
  firstname: zod.string().min(1, { message: 'Povinné pole' }),
  lastname: zod.string().min(1, { message: 'Povinné pole' }),
  birthdate: zod.string().min(1, { message: 'Povinné pole' }),
  deathdate: zod.string().min(1, { message: 'Povinné pole' }),
  streetWithNumber: zod.string().min(1, { message: 'Povinné pole' }),
  city: zod
    .string()
    .min(1, { message: 'Povinné pole' })
    .refine((val) => val === 'Praha' || '', {
      message: 'V současné době je podporována pouze obec Praha',
    }),
  district: zod.string().min(1, { message: 'Povinné pole' }),
  postalCode: zod
    .string()
    .min(1, { message: 'Povinné pole' })
    .regex(postalCodeRegex, { message: 'Neplatné PSČ' }),
});

export type DeceasedPersonFormFields = z.infer<typeof baseDeceasedInfoSchema>;
type DeceasedInfoFormProps = {
  id: string;
  onSubmit: SubmitHandler<DeceasedPersonFormFields>;
};

export const DeceasedPersonForm = ({ id, onSubmit }: DeceasedInfoFormProps) => {
  const { storage } = useEducatorStorage();
  const { validDistrictNames, error } = useValidDistricts();

  const schemaWithDistrictValidation = baseDeceasedInfoSchema.extend({
    district: z.string().refine(
      (district) => {
        // Only validate district if there is no error and validDistrictNames is populated
        return error || validDistrictNames.includes(district);
      },
      {
        message: 'Zadejte platný název okresu či městské části',
      },
    ),
  });

  const completeSchema = schemaWithDistrictValidation.refine(
    (data) => {
      const birthdate = new Date(data.birthdate);
      const deathdate = new Date(data.deathdate);
      return deathdate > birthdate;
    },
    {
      message: 'Datum úmrtí musí být větší než datum narození',
      path: ['deathdate'],
    },
  );

  const formData = storage.deceasedPersonFormData;
  return (
    <Form
      id={id}
      resolver={zodResolver(completeSchema)}
      defaultValues={{
        sex: formData ? formData.sex : '',
        firstname: formData ? formData.firstname : '',
        lastname: formData ? formData.lastname : '',
        birthdate: formData ? formData.birthdate : '',
        deathdate: formData ? formData.deathdate : '',
        streetWithNumber: formData ? formData.streetWithNumber : '',
        city: formData ? formData.city : '',
        district: formData ? formData.district : '',
        postalCode: formData ? formData.postalCode : '',
      }}
      onSubmit={(data) => onSubmit(data)}
    >
      <Flex mb="6">
        <RadioGroupField name="sex" label="Pohlaví zůstavitele">
          <Flex direction="row" gap="8">
            <Radio value="male">muž</Radio>
            <Radio value="female">žena</Radio>
          </Flex>
        </RadioGroupField>
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
      <Flex
        direction={{
          base: 'column',
          md: 'row',
        }}
        mb="6"
        gap="5"
      >
        <InputField
          name="birthdate"
          label="Datum narození zůstavitele"
          placeholder="Zadejte datum narození zůstavitele"
          type="date"
        />
        <InputField
          name="deathdate"
          label="Datum úmrtí zůstavitele"
          placeholder="Zadejte datum úmrtí zůstavitele"
          type="date"
        />
      </Flex>
      <AutocompleteAddress />
    </Form>
  );
};
