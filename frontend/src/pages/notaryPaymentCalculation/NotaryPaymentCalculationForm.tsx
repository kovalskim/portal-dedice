import React from 'react';
import { InputGroup } from '@chakra-ui/icons';
import { Box, Text } from '@chakra-ui/layout';
import { InputRightElement, Stack } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler } from 'react-hook-form';
import * as z from 'zod';

import { Form, InputField, PrimaryButton } from '@frontend/components';

export type FormFields = z.infer<typeof schema>;

type NotaryPaymentCalculationFormProps = {
  onSubmit: SubmitHandler<FormFields>;
  loading: boolean;
};

const schema = z.object({
  estateTotalValue: z.preprocess(
    (value) => (typeof value === 'string' ? Number(value) : value),
    z
      .number()
      .min(1, { message: 'Celková hodnota musí být minimálně 1 Kč' })
      .refine((value) => !isNaN(value), { message: 'Hodnota musí být číslo' }),
  ),
});

export const NotaryPaymentCalculationForm: React.FC<
  NotaryPaymentCalculationFormProps
> = ({ onSubmit, loading }) => {
  return (
    <Box mt={4}>
      <Form
        defaultValues={{
          estateTotalValue: 0,
        }}
        onSubmit={onSubmit}
        resolver={zodResolver(schema)}
      >
        <Stack direction={{ base: 'column', lg: 'row' }} mb={4}>
          <Text fontSize="sm" fontWeight="semibold">
            Hodnota majetku v pozůstalosti
          </Text>

          <InputGroup>
            <InputField
              name="estateTotalValue"
              type="number"
              placeholder="Zadejte hodnotu majetku v pozůstalosti"
              isRequired={true}
            />
            <InputRightElement pointerEvents="none">
              <Text color="gray.500" fontSize="sm">
                Kč
              </Text>
            </InputRightElement>
          </InputGroup>

          <PrimaryButton
            type="submit"
            isLoading={loading}
            minWidth={{ base: '100%', md: 'auto' }}
          >
            Vypočítat odměnu
          </PrimaryButton>
        </Stack>
      </Form>
    </Box>
  );
};
