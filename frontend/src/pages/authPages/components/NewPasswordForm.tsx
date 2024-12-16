import React, { FC } from 'react';
import { Box, Center, Heading, Stack, Text } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler } from 'react-hook-form';
import * as z from 'zod';

import { PrimaryButton } from '@frontend/components/buttons';
import { InputField } from '@frontend/components/forms/fields/InputField';
import { Form } from '@frontend/components/forms/Form';
import { RouterLink } from '@frontend/components/navigation/atoms';
import { Routes } from '@frontend/routes/routes.ts';

export type FormFields = z.infer<typeof schema>;

type NewPasswordFormProps = {
  onSubmit: SubmitHandler<FormFields>;
  loading: boolean;
};

const schema = z
  .object({
    password: z.string().min(8, { message: 'Heslo musí mít alespoň 8 znaků.' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Hesla se neshodují.',
    path: ['confirmPassword'],
  });

export const NewPasswordForm: FC<NewPasswordFormProps> = ({
  onSubmit,
  loading,
}) => {
  return (
    <Box>
      <Heading size="md" mb={12} textAlign="center">
        Nastavte si nové heslo
      </Heading>
      <Form
        defaultValues={{
          password: '',
          confirmPassword: '',
        }}
        resolver={zodResolver(schema)}
        onSubmit={onSubmit}
      >
        <Stack spacing={5} mb={8}>
          <Box>
            <InputField
              name="password"
              type="password"
              label="Heslo"
              isRequired={true}
            />
            <Text fontSize={'sm'}>Heslo musí mít alespoň 8&nbsp;znaků</Text>
          </Box>
          <Box>
            <InputField
              name="confirmPassword"
              type="password"
              label="Znovu heslo"
              isRequired={true}
            />
          </Box>
        </Stack>

        <Center>
          <PrimaryButton type="submit" isLoading={loading}>
            Nastavit nové heslo
          </PrimaryButton>
        </Center>
      </Form>

      <Text mt={8} textAlign="center">
        <RouterLink to={Routes.logIn}>&larr; Zpět na přihlášení</RouterLink>
      </Text>
    </Box>
  );
};
