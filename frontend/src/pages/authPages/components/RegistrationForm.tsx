import { Box } from '@chakra-ui/layout';
import { Center, Flex, Heading, Stack, Text } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler } from 'react-hook-form';
import * as z from 'zod';

import { Form, InputField, PrimaryButton } from '@frontend/components';
import { RouterLink } from '@frontend/components/navigation/atoms';
import { Routes } from '@frontend/routes';

export type FormFields = z.infer<typeof schema>;

type RegistrationFormProps = {
  onSubmit: SubmitHandler<FormFields>;
  loading: boolean;
  error: Error | undefined;
};

const schema = z
  .object({
    firstname: z.string().min(1, { message: 'Jméno nesmí být prázdné' }),
    lastname: z.string().min(1, { message: 'Příjmení nesmí být prázdné.' }),
    email: z.string().email({ message: 'Zadejte platnou emailovou adresu.' }),
    password: z.string().min(8, { message: 'Heslo musí mít alespoň 8 znaků.' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Hesla se neshodují.',
    path: ['confirmPassword'],
  });

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  onSubmit,
  loading,
  error,
}) => {
  return (
    <Box>
      <Heading size="md" mb={8} textAlign="center">
        Vyplňte registrační formulář
      </Heading>
      <Form
        defaultValues={{
          firstname: '',
          lastname: '',
          email: '',
          password: '',
          confirmPassword: '',
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
            <InputField name="password" type="password" label="Heslo" />
            <InputField
              name="confirmPassword"
              type="password"
              label="Znovu heslo"
            />
          </Flex>
        </Stack>

        <Center mt={8}>
          <PrimaryButton type="submit" isLoading={loading}>
            Registrovat se
          </PrimaryButton>
        </Center>
        {error && (
          <Center mt={4}>
            <Text color="red.500">
              Uživatel se zadanou emailovou adresou již existuje
            </Text>
          </Center>
        )}
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
