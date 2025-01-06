import { Flex, Radio } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler } from 'react-hook-form';
import { z } from 'zod';

import { AutocompleteAddress } from '@frontend/components/forms/deceasedPersonForm/AutocompleteAddress.tsx';
import { InputField } from '@frontend/components/forms/fields/InputField';
import { RadioGroupField } from '@frontend/components/forms/fields/RadioGroupField';
import { Form } from '@frontend/components/forms/Form';
import { useValidDistricts } from '@frontend/hooks/useValidDistricts.ts';
import { deceasedInfoSchema } from '@shared/schemas/deceasedInfoSchema';

export type DeceasedPersonFormFields = z.infer<typeof deceasedInfoSchema>;
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
  const { validDistrictNames } = useValidDistricts();

  const schemaWithDistrictValidation = deceasedInfoSchema.refine(
    (data) => {
      return validDistrictNames.includes(data.district);
    },
    {
      message: 'Zadejte platný název okresu či městské části',
      path: ['district'],
    },
  );

  const formData = loadDefaultFrom;
  return (
    <Form
      id={id}
      resolver={zodResolver(schemaWithDistrictValidation)}
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
