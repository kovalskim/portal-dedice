import React, { FC, useEffect } from 'react';
import { ApolloError } from '@apollo/client';
import { Box, Center, Heading, Stack, Text } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler } from 'react-hook-form';
import * as z from 'zod';

import { Form, InputField, PrimaryButton } from '@frontend/components';
import { RouterLink } from '@frontend/components/navigation/atoms';
import { useCustomToast } from '@frontend/hooks/useCustomToast.ts';
import { Routes } from '@frontend/routes.ts';

export type FormFields = z.infer<typeof schema>;

type LogInFormProps = {
  onSubmit: SubmitHandler<FormFields>;
  loading: boolean;
  error: ApolloError | undefined;
};

const schema = z.object({
  email: z.string().email({ message: 'Zadejte platnou emailovou adresu' }),
  password: z.string().min(1, { message: 'Heslo nesmí být prázdné' }),
});

export const LogInForm: FC<LogInFormProps> = ({ onSubmit, loading, error }) => {
  const showToast = useCustomToast();

  useEffect(() => {
    if (error && error?.graphQLErrors[0]?.extensions?.code === 'NOT_VERIFIED') {
      showToast({
        title: 'Účet nebyl ověřen.',
        description: 'Zkontrolujte si email a dokončete registraci.',
        status: 'error',
      });
    } else if (
      error &&
      error?.graphQLErrors[0]?.extensions?.code !== 'NOT_VERIFIED'
    ) {
      showToast({
        title: 'Zadali jste neplatné přihlašovací údaje.',
        description: 'Zkuste to prosím znovu.',
        status: 'error',
      });
    }
  }, [error, showToast]);

  return (
    <Box>
      <Heading size="md" mb={12} textAlign="center">
        Vyplňte přihlašovací formulář
      </Heading>

      <Form
        defaultValues={{
          email: '',
          password: '',
        }}
        resolver={zodResolver(schema)}
        onSubmit={onSubmit}
      >
        <Stack spacing={5} mb={8}>
          <InputField
            name="email"
            type="text"
            label="E-mailová adresa"
            placeholder={'@'}
          />
          <InputField name="password" type="password" label="Heslo" />
          <RouterLink to={Routes.forgottenPassword} mt={-4} textAlign="right">
            Zapomenuté heslo
          </RouterLink>
        </Stack>

        <Center>
          <PrimaryButton type="submit" isLoading={loading}>
            Přihlásit se
          </PrimaryButton>
        </Center>
      </Form>

      <Text mt={8} textAlign="center">
        Ještě nemáte vytvořený účet?{' '}
        <RouterLink to={Routes.signUp}>Zaregistrujte se</RouterLink>
      </Text>
    </Box>
  );
};
