import React, { FC, useEffect } from 'react';
import { ApolloError } from '@apollo/client';
import { Box } from '@chakra-ui/layout';
import { Center, Flex, Stack } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler } from 'react-hook-form';
import * as z from 'zod';

import { Form, InputField, PrimaryButton } from '@frontend/components';
import { useAuth } from '@frontend/context/auth';
import { useCustomToast } from '@frontend/hooks/useCustomToast.ts';

export type FormFields = z.infer<typeof schema>;

type ChangePersonalDataFormProps = {
  onSubmit: SubmitHandler<FormFields>;
  loading: boolean;
  error: ApolloError | undefined;
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
  error,
}) => {
  const showToast = useCustomToast();

  const { user } = useAuth();

  useEffect(() => {
    if (error) {
      showToast({
        title: 'Něco se pokazilo',
        description:
          'Nepodařilo se uložit osobní údaje. Zkuste to prosím znovu.',
        status: 'error',
      });
    }
  }, [error, showToast]);

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
