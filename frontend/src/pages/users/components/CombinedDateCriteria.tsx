import React, { type ReactNode } from 'react';
import { AddIcon, MinusIcon } from '@chakra-ui/icons';
import { Box } from '@chakra-ui/layout';
import { Flex, Text } from '@chakra-ui/react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { PrimaryButton, SecondaryButton } from '@frontend/components/buttons';
import { FancySelectField } from '@frontend/components/forms/fields/FancySelectField.tsx';

type CombinedDateCriteriaProps = {
  label: string;
  name: string;
  isDisabled?: boolean;
};

export const CombinedDateCriteria = ({
  label,
  name,
  isDisabled = false,
}: CombinedDateCriteriaProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: name,
  });

  return (
    <Box>
      <Text fontSize="md" fontWeight="medium" mb={3}>
        {label}
      </Text>
      <Flex direction="column" gap={3}>
        {fields.map((field, index) => (
          <Box key={field.id} width="100%">
            <Flex justifyContent="space-between" alignContent="center" gap={5}>
              <FancySelectField
                label=""
                isMulti
                name={`${name}.${index}.days`}
                placeholder="Vyberte dny"
                options={Array.from({ length: 31 }, (_, i) => i + 1).map(
                  (val) => ({ label: val, value: val }),
                )}
                isDisabled={isDisabled}
              />
              <FancySelectField
                label=""
                isMulti
                name={`${name}.${index}.months`}
                placeholder="Vyberte měsíce"
                options={Array.from({ length: 12 }, (_, i) => i + 1).map(
                  (val) => ({ label: val, value: val }),
                )}
                isDisabled={isDisabled}
              />
              <SecondaryButton
                size="sm"
                onClick={() => remove(index)}
                isDisabled={fields.length === 1}
              >
                <MinusIcon fontSize="xs" />
              </SecondaryButton>
            </Flex>
            {errors[name] && (
              <Text color="red.500" fontSize="sm" mt={1}>
                {errors[name]?.root?.message as ReactNode}
              </Text>
            )}
          </Box>
        ))}
        <Flex alignItems="start">
          <PrimaryButton
            variant="outline"
            size="sm"
            onClick={() =>
              append({
                days: [],
                months: [],
              })
            }
          >
            <AddIcon fontSize="xs" mr={1} />
            Přidat omezení
          </PrimaryButton>
        </Flex>
      </Flex>
    </Box>
  );
};
