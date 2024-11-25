import { useEffect } from 'react';
import { Box } from '@chakra-ui/layout';
import { Center, Flex, Heading, Stack, Text, Tooltip } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler } from 'react-hook-form';
import * as z from 'zod';

import { Form, InputField, PrimaryButton } from '@frontend/components';
import { RouterLink } from '@frontend/components/navigation/atoms';
import { useCustomToast } from '@frontend/hooks/useCustomToast.ts';
import { Routes } from '@frontend/routes/routes.ts';

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
  const showToast = useCustomToast();

  useEffect(() => {
    if (error) {
      showToast({
        title: 'Registrace se nezdařila.',
        description: 'Uživatel se zadanou emailovou adresou již existuje.',
        status: 'error',
      });
    }
  }, [error, showToast]);

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
