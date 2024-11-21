import { Flex, Radio } from '@chakra-ui/react';
import { SubmitHandler } from 'react-hook-form';
import { z } from 'zod';

import { Form, InputField, RadioGroupField } from '@frontend/components';
import { zodResolver } from '@frontend/components/forms';
import { AutocompleteAddress } from '@frontend/components/forms/deceasedPersonForm/AutocompleteAddress.tsx';
import { baseDeceasedInfoSchema } from '@frontend/components/forms/deceasedPersonForm/baseDeceasedInfoSchema.ts';
import { useValidDistricts } from '@frontend/pages/educator/components/notary-identification/useValidDistricts.ts';

export type DeceasedPersonFormFields = z.infer<typeof baseDeceasedInfoSchema>;
type DeceasedInfoFormProps = {
  id: string;
  loadDefaultFrom?: DeceasedPersonFormFields | undefined;
  onSubmit: SubmitHandler<DeceasedPersonFormFields>;
};

export const DeceasedPersonForm = ({
  id,
  onSubmit,
  loadDefaultFrom,
}: DeceasedInfoFormProps) => {
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

  const formData = loadDefaultFrom;
  return (
    <Form
      id={id}
      resolver={zodResolver(completeSchema)}
      defaultValues={{
        sex: formData?.sex ?? '',
        firstname: formData?.firstname ?? '',
        lastname: formData?.lastname ?? '',
        birthdate: formData?.birthdate ?? '',
        deathdate: formData?.deathdate ?? '',
        streetWithNumber: formData?.streetWithNumber ?? '',
        city: formData?.city ?? '',
        district: formData?.district ?? '',
        postalCode: formData?.postalCode ?? '',
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
