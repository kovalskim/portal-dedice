import { FC, useEffect } from 'react';
import { ApolloError } from '@apollo/client';
import { Box } from '@chakra-ui/layout';
import { Center, Flex, Stack } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler } from 'react-hook-form';
import * as z from 'zod';

import { PrimaryButton } from '@frontend/components/buttons';
import { CheckboxField } from '@frontend/components/forms/fields/CheckboxField';
import { Form } from '@frontend/components/forms/Form';
import { useAuth } from '@frontend/context/auth/auth-core';
import { useCustomToast } from '@frontend/hooks/useCustomToast.ts';

export type FormFields = z.infer<typeof schema>;

type PreferencesFormProps = {
  onSubmit: SubmitHandler<FormFields>;
  loading: boolean;
  error: ApolloError | undefined;
};

const schema = z.object({
  emailNotifications: z.boolean(),
});

export const PreferencesForm: FC<PreferencesFormProps> = ({
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
          emailNotifications: user?.emailNotifications,
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
            <CheckboxField
              name="emailNotifications"
              label="Emailové notifikace (např. upozornění na nové zprávy, úkoly apod.)"
            />
          </Flex>
        </Stack>
        <Center mt={8}>
          <PrimaryButton type="submit" isLoading={loading}>
            Uložit preference
          </PrimaryButton>
        </Center>
      </Form>
    </Box>
  );
};
