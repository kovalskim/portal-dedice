import React from 'react';
import { Box } from '@chakra-ui/layout';
import { Table, TableContainer, Th, Thead, Tr } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler } from 'react-hook-form';

import { Form } from '@frontend/components/forms/Form.tsx';
import { AssetInputs } from '@frontend/pages/educator/components/assetsDistribution/AssetInputs.tsx';
import {
  AssetFields,
  AssetsIdentificationFormFields,
  assetsIdentificationFormSchema,
} from '@frontend/pages/educator/components/assetsDistribution/assetsIdentificationFormSchema.ts';

type AssetsIdentificationFormProps = {
  id: string;
  onSubmit: SubmitHandler<AssetsIdentificationFormFields>;
  defaultValues?: AssetFields[];
};

export const AssetsIdentificationForm = ({
  id,
  onSubmit,
  defaultValues,
}: AssetsIdentificationFormProps) => {
  return (
    <Form
      id={id}
      onSubmit={onSubmit}
      resolver={zodResolver(assetsIdentificationFormSchema)}
      defaultValues={{
        assets: defaultValues || [{ type: '', name: '', value: 0, SJM: true }],
      }}
    >
      <Box overflowX="auto">
        <TableContainer
          overflow="auto hidden"
          maxW="100%"
          whiteSpace="nowrap"
          display="block"
        >
          <Table variant="simple" size={{ base: 'sm', md: 'md' }}>
            <Thead>
              <Tr>
                <Th></Th>
                <Th>Typ</Th>
                <Th>Název</Th>
                <Th>Hodnota (Kč) </Th>
                <Th>SJM</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <AssetInputs />
          </Table>
        </TableContainer>
      </Box>
    </Form>
  );
};
