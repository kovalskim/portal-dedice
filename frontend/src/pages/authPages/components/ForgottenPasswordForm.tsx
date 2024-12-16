import { FC } from 'react';
import { Box, Center, Heading, Stack, Text } from '@chakra-ui/react';
import { SubmitHandler } from 'react-hook-form';
import * as z from 'zod';

import { PrimaryButton } from '@frontend/components/buttons';
import { InputField } from '@frontend/components/forms/fields/InputField';
import { Form } from '@frontend/components/forms/Form';
import { RouterLink } from '@frontend/components/navigation/atoms';
import { Routes } from '@frontend/routes/routes.ts';

export type FormFields = z.infer<typeof schema>;

type ForgottenPasswordFormProps = {
  onSubmit: SubmitHandler<FormFields>;
  loading: boolean;
};

const schema = z.object({
  email: z.string().email({ message: 'Zadejte platnou emailovou adresu.' }),
});

export const ForgottenPasswordForm: FC<ForgottenPasswordFormProps> = ({
  onSubmit,
  loading,
}) => {
  return (
    <Box>
      <Heading size="md" mb={12} textAlign="center">
        Zadejte Vaší e-mailovou adresu
      </Heading>
      <Form onSubmit={onSubmit}>
        <Stack spacing={5} mb={8}>
          <InputField
            name="email"
            type="text"
            label="E-mailová adresa"
            placeholder={'@'}
            isRequired={true}
          />
        </Stack>

        <Center>
          <PrimaryButton type="submit" isLoading={loading}>
            Odeslat
          </PrimaryButton>
        </Center>
      </Form>

      <Text mt={8} textAlign="center">
        <RouterLink to={Routes.logIn}>&larr; Zpět na přihlášení</RouterLink>
      </Text>
    </Box>
  );
};
