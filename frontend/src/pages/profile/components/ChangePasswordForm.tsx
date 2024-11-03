import React from 'react';
import { ApolloError } from '@apollo/client';
import { Box } from '@chakra-ui/layout';
import { Center, Flex, Stack, Text } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler } from 'react-hook-form';
import * as z from 'zod';

import { Form, InputField, PrimaryButton } from '@frontend/components';

export type FormFields = z.infer<typeof schema>;

type ChangePasswordFormProps = {
  onSubmit: SubmitHandler<FormFields>;
  loading: boolean;
  error: ApolloError | undefined;
};

const schema = z
  .object({
    oldPassword: z.string().min(1, { message: 'Heslo nesmí být prázdné' }),
    newPassword: z
      .string()
      .min(8, { message: 'Heslo musí mít alespoň 8 znaků.' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Hesla se neshodují.',
    path: ['confirmPassword'],
  });

export const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({
  onSubmit,
  loading,
  error,
}) => {
  return (
    <Box mt={4}>
      <Form
        defaultValues={{
          oldPassword: '',
          newPassword: '',
          confirmPassword: '',
        }}
        onSubmit={onSubmit}
        resolver={zodResolver(schema)}
      >
        <Stack spacing={5}>
          <Box>
            <InputField
              name={'oldPassword'}
              type={'password'}
              label={'Staré heslo'}
              isRequired={true}
              isInvalid={!!error}
            />
            {error && <Text color="red.500">Špatně zadané heslo</Text>}
          </Box>
          <Flex
            direction={{
              base: 'column',
              md: 'row',
            }}
            gap="5"
          >
            <Box width="100%">
              <InputField
                name={'newPassword'}
                type={'password'}
                label={'Nové heslo'}
                isRequired={true}
              />
              <Text fontSize={'sm'}>Heslo musí mít alespoň 8&nbsp;znaků</Text>
            </Box>
            <Box width="100%">
              <InputField
                name={'confirmPassword'}
                type={'password'}
                label={'Potvrzení hesla'}
                isRequired={true}
              />
            </Box>
          </Flex>
        </Stack>
        <Center mt={8}>
          <PrimaryButton type="submit" isLoading={loading}>
            Uložit nové heslo
          </PrimaryButton>
        </Center>
      </Form>
    </Box>
  );
};
