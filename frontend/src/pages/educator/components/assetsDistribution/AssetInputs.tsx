import React from 'react';
import { AddIcon, MinusIcon, Tfoot } from '@chakra-ui/icons';
import { Button, Flex, Tbody, Td, Text, Th, Tr } from '@chakra-ui/react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { SecondaryButton } from '@frontend/components/buttons';
import { CheckboxField } from '@frontend/components/forms/fields/CheckboxField.tsx';
import { InputField } from '@frontend/components/forms/fields/InputField.tsx';
import { SelectField } from '@frontend/components/forms/fields/SelectField.tsx';
import { AssetsIdentificationFormFields } from '@frontend/pages/educator/components/assetsDistribution/assetsIdentificationFormSchema.ts';
import { assetTypes } from '@frontend/pages/educator/components/assetsDistribution/constants.ts';

export const AssetInputs = () => {
  const { control } = useFormContext<AssetsIdentificationFormFields>();

  const name = 'assets';

  const { fields, append, remove } = useFieldArray({
    control,
    name: name,
  });

  return (
    <>
      <Tbody>
        {fields.map((field, index) => (
          <Tr key={field.id}>
            <Td style={{ padding: 10, verticalAlign: 'top' }}>
              <Text mt={2}>{index + 1}.</Text>
            </Td>
            <Td style={{ padding: 10, verticalAlign: 'top' }}>
              <Flex>
                <SelectField
                  name={`${name}.${index}.type`}
                  label=""
                  placeholder="Zvolte typ majetku"
                >
                  {assetTypes.map((type, index) => (
                    <option value={type} key={index}>
                      {type}
                    </option>
                  ))}
                </SelectField>
              </Flex>
            </Td>
            <Td style={{ padding: 10, verticalAlign: 'top' }}>
              <InputField name={`${name}.${index}.name`} label="" />
            </Td>
            <Td style={{ padding: 10, verticalAlign: 'top' }}>
              <InputField
                name={`${name}.${index}.value`}
                label=""
                type="number"
              />
            </Td>
            <Td
              style={{
                padding: 10,
                verticalAlign: 'top',
                textAlign: 'center',
              }}
            >
              <CheckboxField mt={2} name={`${name}.${index}.SJM`} label="" />
            </Td>
            <Td style={{ padding: 10, verticalAlign: 'top' }}>
              <SecondaryButton
                size="sm"
                onClick={() => remove(index)}
                isDisabled={fields.length === 1}
              >
                <MinusIcon fontSize="xs" color="red" />
              </SecondaryButton>
            </Td>
          </Tr>
        ))}
      </Tbody>
      <Tfoot>
        <Tr>
          <Th colSpan={6}>
            <Button
              size="sm"
              variant="ghost"
              w="100%"
              onClick={() => {
                append({
                  type: '',
                  name: '',
                  value: 0,
                  SJM: true,
                });
              }}
              color="green.500"
            >
              <AddIcon />
            </Button>
          </Th>
        </Tr>
      </Tfoot>
    </>
  );
};
