import React from 'react';
import { Box } from '@chakra-ui/layout';
import {
  Center,
  Flex,
  Heading,
  Spinner,
  Stack,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler } from 'react-hook-form';
import * as z from 'zod';

import { PrimaryButton } from '@frontend/components/buttons';
import { InputField } from '@frontend/components/forms/fields/InputField';
import { Form } from '@frontend/components/forms/Form';
import { RouterLink } from '@frontend/components/navigation/atoms';
import { useTokenVerification } from '@frontend/hooks/useTokenVerification.ts';
import { Routes } from '@frontend/routes/routes.ts';

export type FormFields = z.infer<typeof schema>;

type RegistrationFormProps = {
  onSubmit: SubmitHandler<FormFields>;
  loading: boolean;
};

const schema = z
  .object({
    firstname: z.string().min(1, { message: 'Jméno nesmí být prázdné' }),
    lastname: z.string().min(1, { message: 'Příjmení nesmí být prázdné.' }),
    email: z.string().email({ message: 'Zadejte platnou emailovou adresu.' }),
    password: z.string().min(8, { message: 'Heslo musí mít alespoň 8 znaků.' }),
    confirmPassword: z.string(),
    token: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Hesla se neshodují.',
    path: ['confirmPassword'],
  });

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  onSubmit,
  loading,
}) => {
  const { token, payload, tokenVerificationLoading } = useTokenVerification(
    'invitation_token',
    Routes.signUp,
  );

  if (tokenVerificationLoading)
    return (
      <Flex justifyContent="center" alignItems="center" direction="column">
        <Spinner size="xl" color="goldenYellow.500"></Spinner>
        <Text size="lg" my={4}>
          Probíhá ověřování tokenu z pozvánky...
        </Text>
      </Flex>
    );

  return (
    <Box>
      <Heading size="md" mb={8} textAlign="center">
        Vyplňte registrační formulář
      </Heading>
      <Form
        defaultValues={{
          firstname: payload?.verifyToken?.firstname || '',
          lastname: payload?.verifyToken?.lastname || '',
          email: payload?.verifyToken?.email || '',
          password: '',
          confirmPassword: '',
          token: token || '',
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
            <InputField name="firstname" type="text" label="Jméno" />
            <InputField name="lastname" type="text" label="Příjmení" />
          </Flex>
          <InputField
            name="email"
            type="text"
            label="Emailová adresa"
            placeholder="@"
          />
          <Flex
            direction={{
              base: 'column',
              md: 'row',
            }}
            gap="5"
          >
            <Box>
              <Tooltip
                hasArrow
                bg="gray.100"
                color="black"
                fontSize="xs"
                fontWeight="normal"
                label="Minimálně 8 znaků"
                placement="top-end"
              >
                <InputField name="password" type="password" label="Heslo" />
              </Tooltip>
            </Box>
            <Box>
              <InputField
                name="confirmPassword"
                type="password"
                label="Znovu heslo"
              />
            </Box>
          </Flex>
          <InputField name="token" type="hidden" />
        </Stack>

        <Center mt={8}>
          <PrimaryButton type="submit" isLoading={loading}>
            Registrovat se
          </PrimaryButton>
        </Center>
        <Center mt="8">
          <Text>
            Již máte založený účet?{' '}
            <RouterLink to={Routes.logIn}>Přihlaste se</RouterLink>
          </Text>
        </Center>
      </Form>
    </Box>
  );
};
