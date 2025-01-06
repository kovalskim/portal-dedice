import React, { useState } from 'react';
import { Box } from '@chakra-ui/layout';
import { Flex, Radio } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler } from 'react-hook-form';
import * as z from 'zod';

import { InputField } from '@frontend/components/forms/fields/InputField.tsx';
import { RadioGroupField } from '@frontend/components/forms/fields/RadioGroupField.tsx';
import { Form } from '@frontend/components/forms/Form.tsx';
import { Role } from '@frontend/context/auth/auth-core.tsx';
import { RulesInput } from '@frontend/pages/users/components/RulesInput.tsx';
import { inviteUserFormSchema } from '@shared/schemas/InviteUserFormSchema.ts';

export type UserInvitationFormFields = z.infer<typeof inviteUserFormSchema>;

type UserInvitationFormProps = {
  id: string;
  onSubmit: SubmitHandler<UserInvitationFormFields>;
};

export const UserInvitationForm = ({
  id,
  onSubmit,
}: UserInvitationFormProps) => {
  const [roleValue, setRoleValue] = useState('');

  return (
    <Form
      id={id}
      onSubmit={onSubmit}
      resolver={zodResolver(inviteUserFormSchema)}
      defaultValues={{
        firstname: '',
        lastname: '',
        email: '',
        role: '',
        court: undefined,
        lastnameLetters: [],
        birthDaysMonths: [{ days: [], months: [] }],
        deathDaysMonths: [{ days: [], months: [] }],
        rules: {
          lastnameLetters: false,
          birthDaysMonths: false,
          deathDaysMonths: false,
        },
      }}
    >
      <Box mb={5}>
        <Flex direction="column" gap={5}>
          <Flex
            direction={{
              base: 'column',
              md: 'row',
            }}
            gap="5"
          >
            <InputField name="firstname" type="text" label="Jméno" />
            <InputField name="lastname" type="text" label="Příjmení" />
          </Flex>
          <InputField
            name="email"
            type="text"
            label="Emailová adresa"
            placeholder="@"
          />
        </Flex>
      </Box>
      <Box mb={8}>
        <RadioGroupField
          name="role"
          label="Role uživatele"
          onChange={(value) => setRoleValue(value)}
          value={roleValue}
        >
          <Flex direction="row" gap="10">
            <Radio value={Role.USER}>Uživatel</Radio>
            <Radio value={Role.NOTARY}>Notář</Radio>
            <Radio value={Role.ADMIN}>Administrátor</Radio>
          </Flex>
        </RadioGroupField>
      </Box>
      {roleValue === Role.NOTARY && <RulesInput />}
    </Form>
  );
};
