import React, { ReactNode } from 'react';
import { Box } from '@chakra-ui/layout';
import { Flex, SystemStyleObject, Text } from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';

import { FancySelectField } from '@frontend/components/forms/fields/FancySelectField.tsx';
import { Court } from '@frontend/gql/user/queries.ts';
import { useCourts } from '@frontend/hooks/useCourts.ts';
import { CombinedDateCriteria } from '@frontend/pages/users/components/CombinedDateCriteria.tsx';
import { RuleActivationInput } from '@frontend/pages/users/components/RuleActivationInput.tsx';
import { UserInvitationFormFields } from '@frontend/pages/users/components/UserInvitationForm.tsx';
import { ALPHABET_CZ } from '@frontend/pages/users/constants.ts';

export const RulesInput = () => {
  const { data } = useCourts();

  const {
    watch,
    formState: { errors },
  } = useFormContext<UserInvitationFormFields>();
  const rules = watch('rules');

  return (
    <Box mb={5}>
      <Text fontSize="md" fontWeight="medium" mb={3}>
        Kritéria přiřazování případů:
      </Text>
      {errors.rules && (
        <Text color="red.500" fontSize="sm" mb={3}>
          {errors.rules?.message as ReactNode}
        </Text>
      )}
      <Flex direction="column" gap={5} mb={10}>
        {/* Oblast */}
        <FancySelectField
          label="Místně příslušný soud"
          name="court"
          placeholder="Vyberte soud"
          //isMulti
          options={
            data?.courts?.map((val: Court) => ({
              label: val.name,
              value: val.id,
            })) || []
          }
          chakraStyles={{
            container: (provided: SystemStyleObject) => ({
              ...provided,
              width: '100%',
            }),
          }}
        />
        {/* Příjmení zůstavitele */}
        <RuleActivationInput
          ruleName={'rules.lastnameLetters'}
          ruleValue={rules.lastnameLetters}
        >
          <FancySelectField
            label="Příjmení zůstavitele"
            name="lastnameLetters"
            placeholder="Vyberte počáteční písmena"
            isMulti
            options={ALPHABET_CZ.map((letter) => ({
              label: letter,
              value: letter,
            }))}
            chakraStyles={{
              container: (provided: SystemStyleObject) => ({
                ...provided,
                width: '100%',
              }),
            }}
          />
        </RuleActivationInput>
        {/* Datum narození */}
        <RuleActivationInput
          ruleName={'rules.birthDaysMonths'}
          ruleValue={rules.birthDaysMonths}
        >
          <CombinedDateCriteria
            label={'Den a měsíc narození zůstavitele:'}
            name={'birthDaysMonths'}
          />
        </RuleActivationInput>
        {/* Datum úmrtí */}
        <RuleActivationInput
          ruleName={'rules.deathDaysMonths'}
          ruleValue={rules.deathDaysMonths}
        >
          <CombinedDateCriteria
            label={'Den a měsíc úmrtí zůstavitele:'}
            name={'deathDaysMonths'}
          />
        </RuleActivationInput>
      </Flex>
    </Box>
  );
};
