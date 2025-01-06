import React from 'react';
import { type ReactNode } from 'react';
import { Box } from '@chakra-ui/layout';
import { Flex, Radio, RadioGroup, Stack, Text } from '@chakra-ui/react';
import { FieldPath, useFormContext } from 'react-hook-form';

import { UserInvitationFormFields } from '@frontend/pages/users/components/UserInvitationForm.tsx';

type MultiSelectCriterionProps = {
  ruleName?: string;
  ruleValue?: boolean;
  children: ReactNode;
};

export const RuleActivationInput = ({
  ruleName,
  ruleValue,
  children,
}: MultiSelectCriterionProps) => {
  const { setValue } = useFormContext<UserInvitationFormFields>();

  return (
    <Box width="100%">
      <Flex direction="row" alignItems="start" justifyContent="space-between">
        <Box width="80%">{children}</Box>
        <Flex direction="column" ms={0}>
          <Text fontSize="sm">Aktivovat pravidlo</Text>
          <RadioGroup
            mt={2}
            onChange={(value) =>
              setValue(
                ruleName as FieldPath<UserInvitationFormFields>,
                value === 'true',
              )
            }
            defaultValue={ruleValue ? 'true' : 'false'}
          >
            <Stack direction="row">
              <Radio value="false" colorScheme="goldenYellow">
                Ne
              </Radio>
              <Radio value="true" colorScheme="goldenYellow">
                Ano
              </Radio>
            </Stack>
          </RadioGroup>
        </Flex>
      </Flex>
    </Box>
  );
};
