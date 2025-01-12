import { FC } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { Box, Button, Flex, Heading, Text } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { MdSync } from 'react-icons/md';
import { useOutletContext } from 'react-router-dom';
import { z } from 'zod';

import { Form } from '@frontend/components/forms/Form';
import { CREATE_OR_UPDATE_ASSET } from '@frontend/gql/assets/mutations';
import {
  ASSETS_BY_PROCEEDING_ID,
  AssetsAll,
} from '@frontend/gql/assets/queries';
import { useCustomToast } from '@frontend/hooks/useCustomToast';
import { formatTimestamp } from '@frontend/utils/generalUtil';

import { OutletContextType } from '../overview/ProceedingOverviewPage';

import { AssetsActions } from './AssetsActions';
import { Banks } from './Banks';
import { Business } from './Business';
import { Cars } from './Car';
import { Others } from './Others';
import { Valuables } from './Valuables';

const assetsSchema = z.object({
  financialInstruments: z
    .array(
      z.object({
        selectedBank: z.object(
          { label: z.string(), value: z.string() },
          { invalid_type_error: 'Toto pole je povinné' },
        ),
      }),
    )
    .optional(),
  businessParticipations: z
    .array(
      z.object({
        ico: z.string().regex(/^\d{8}$/, 'Nesprávný formát IČa'),
      }),
    )
    .optional(),
  cars: z
    .array(
      z.object({
        brand: z.object(
          { label: z.string(), value: z.string() },
          { invalid_type_error: 'Toto pole je povinné' },
        ),
        registrationYear: z.coerce
          .number()
          .min(1900, 'Musí být větší než 1900')
          .max(new Date().getFullYear(), 'Nesmí být v budoucnu'),
        typeDetail: z.string().min(1, 'Toto pole je povinné'),
      }),
    )
    .optional(),
  valuables: z
    .array(
      z.object({
        description: z.string().min(1, 'Toto pole je povinné'),
      }),
    )
    .optional(),
  others: z
    .array(
      z.object({
        description: z.string().min(1, 'Toto pole je povinné'),
      }),
    )
    .optional(),
});

export type Assets = z.infer<typeof assetsSchema>;

export const AssetsPage: FC = () => {
  const showToast = useCustomToast();
  const { proceeding } = useOutletContext<OutletContextType>();
  const proceedingId = Number(proceeding.id);
  const { data, loading, refetch } = useQuery<{ getAssetById: AssetsAll }>(
    ASSETS_BY_PROCEEDING_ID,
    {
      variables: { proceedingId: Number(proceedingId) },
      onError: () => {
        showToast({
          title: 'Nepodařilo se načíst majetek',
          description:
            'Při načítání majetku dědického řízení se vyskytla chyba.',
          status: 'error',
        });
      },
    },
  );

  const [createOrUpdateAsset, { loading: loadingOfCreateOrUpdate }] =
    useMutation(CREATE_OR_UPDATE_ASSET, {
      onError: () => {
        showToast({
          title: 'Úprava majetku proběhla neúspěšně.',
          description: `Majetekv dědickém řízení nebyl upraven!`,
          status: 'error',
        });
      },
      onCompleted: () => {
        showToast({
          title: 'Úprava majetku proběhla úspěšně.',
          description: `Majetekv dědickém řízení byl upraven!`,
          status: 'success',
        });
      },
      refetchQueries: [ASSETS_BY_PROCEEDING_ID],
    });

  if (loading) {
    return null;
  }

  const onSubmit = async (data: Assets) => {
    await createOrUpdateAsset({
      variables: {
        proceedingId,
        data: {
          ...data,
          financialInstruments: data.financialInstruments?.map((val) => ({
            selectedBank: val.selectedBank.value,
          })),
          cars: data.cars?.map((val) => ({
            ...val,
            brand: val.brand.value,
          })),
        },
      },
    });
  };

  const asset = data?.getAssetById;

  return (
    <Box mt={2}>
      <Flex
        textAlign="left"
        alignItems="flex-start"
        justifyContent={'space-between'}
        pb={4}
        mb={4}
        borderBottom="1px solid"
        borderBottomColor="gray.500"
      >
        <Flex direction="column">
          <Heading size="md" mb={{ base: 2, md: 0 }}>
            Určení majetku
          </Heading>
          <Flex pt={2} gap={2} color="gray.600">
            <Text fontWeight="bold">Naposledy upravil:</Text>
            <Text>
              {asset
                ? `${asset.generalInfo.modifiedBy} ${formatTimestamp(asset.generalInfo.lastModified)}`
                : '-'}
            </Text>
          </Flex>
        </Flex>

        <Button
          variant="ghost"
          onClick={() => {
            refetch();
          }}
        >
          <MdSync size={24} />
        </Button>
      </Flex>
      <Form
        resolver={zodResolver(assetsSchema)}
        onSubmit={onSubmit}
        defaultValues={
          !asset
            ? {
                financialInstruments: [],
                businessParticipations: [],
                cars: [],
                valuables: [],
                others: [],
              }
            : {
                ...asset,
                financialInstruments: asset.financialInstruments.map((val) => ({
                  selectedBank: {
                    value: val.selectedBank,
                    label: val.selectedBank,
                  },
                })),
                cars: asset.cars.map((val) => ({
                  ...val,
                  brand: {
                    value: val.brand,
                    label: val.brand,
                  },
                })),
              }
        }
      >
        <Flex direction="column" gap={2} mb={3}>
          <Banks />
          <Business />
          <Cars />
          <Valuables />
          <Others />
        </Flex>
        <AssetsActions loading={loadingOfCreateOrUpdate} />
      </Form>
    </Box>
  );
};
