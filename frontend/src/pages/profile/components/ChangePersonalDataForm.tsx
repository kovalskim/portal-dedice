import React, { FC } from 'react';
import { Box } from '@chakra-ui/layout';
import { Center, Flex, Stack } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler } from 'react-hook-form';
import * as z from 'zod';

import { PrimaryButton } from '@frontend/components/buttons';
import { InputField } from '@frontend/components/forms/fields/InputField';
import { Form } from '@frontend/components/forms/Form';
import { useAuth } from '@frontend/context/auth/auth-core';

export type FormFields = z.infer<typeof schema>;

type ChangePersonalDataFormProps = {
  onSubmit: SubmitHandler<FormFields>;
  loading: boolean;
};

const schema = z.object({
  beforeTitle: z.string().nullable(),
  firstname: z.string().min(1, { message: 'Jméno nesmí být prázdné' }),
  lastname: z.string().min(1, { message: 'Příjmení nesmí být prázdné' }),
  afterTitle: z.string().nullable(),
});

export const ChangePersonalDataForm: FC<ChangePersonalDataFormProps> = ({
  onSubmit,
  loading,
}) => {
  const { user } = useAuth();

  return (
    <Box mt={4}>
      <Form
        defaultValues={{
          beforeTitle: user?.beforeTitle ?? '',
          firstname: user?.firstname,
          lastname: user?.lastname,
          afterTitle: user?.afterTitle ?? '',
        }}
        resolver={zodResolver(schema)}
        onSubmit={onSubmit}
      >
        <Stack spacing={5}>
          <Flex
            direction={{
              base: 'column',
              md: 'row',
            }}
            gap="5"
          >
            <InputField
              name="beforeTitle"
              type="text"
              label="Titul před jménem"
            />
            <InputField
              name="firstname"
              type="text"
              label="Jméno"
              isRequired={true}
            />
          </Flex>
          <Flex
            direction={{
              base: 'column',
              md: 'row',
            }}
            gap="5"
          >
            <InputField
              name="lastname"
              type="text"
              label="Příjmení"
              isRequired={true}
            />
            <InputField name="afterTitle" type="text" label="Titul za jménem" />
          </Flex>
        </Stack>
        <Center mt={8}>
          <PrimaryButton type="submit" isLoading={loading}>
            Uložit osobní údaje
          </PrimaryButton>
        </Center>
      </Form>
    </Box>
  );
};
