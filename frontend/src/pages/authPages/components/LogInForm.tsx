import React, { FC } from 'react';
import {
  Alert,
  AlertIcon,
  Box,
  Center,
  Heading,
  Stack,
  Text,
} from '@chakra-ui/react';
import { SubmitHandler } from 'react-hook-form';

import { Form, InputField, PrimaryButton, theme } from '@frontend/components';
import { RouterLink } from '@frontend/components/navigation/atoms';
import { FormFields } from '@frontend/pages/authPages/components/RegistrationForm.tsx';
import { Routes } from '@frontend/routes.ts';

type LogInFormProps = {
  onSubmit: SubmitHandler<FormFields>;
  loading: boolean;
  error: Error | undefined;
};

export const LogInForm: FC<LogInFormProps> = ({ onSubmit, loading, error }) => {
  return (
    <Box
      width={{
        base: '90%',
        md: '50%',
        lg: '40%',
      }}
    >
      <Heading as="h1" mb={8} textAlign="center">
        Přihlášení do{' '}
        <span style={{ color: theme.colors.goldenYellow[500] }}>
          Portálu dědice
        </span>
      </Heading>
      <Box
        bg="white"
        py="8"
        px={{
          base: 6,
          md: 12,
        }}
        borderRadius="md"
        boxShadow="md"
      >
        {error && (
          <Alert status="error" mb="8">
            <AlertIcon />
            Zadali jste neplatné přihlašovací údaje. Zkuste to prosím znovu.
          </Alert>
        )}
        <Form onSubmit={onSubmit}>
          <Stack spacing={5}>
            <InputField
              name="email"
              type="text"
              label="Emailová adresa"
              placeholder={'@'}
            />
            <InputField name="password" type="password" label="Heslo" />
            <RouterLink to={Routes.forgottenPassword} mt={-4} textAlign="right">
              Zapomenuté heslo
            </RouterLink>
          </Stack>

          <Center mt={12}>
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
    </Box>
  );
};
