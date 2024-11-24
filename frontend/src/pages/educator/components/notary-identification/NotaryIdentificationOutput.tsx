import { useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { Box } from '@chakra-ui/layout';
import { Alert, AlertIcon, Spinner, Text } from '@chakra-ui/react';

import { InfoHintBox } from '@frontend/components/infoHintBox/InfoHintBox';
import {
  IdentifiedNotary,
  IDENTIFY_NOTARY,
} from '@frontend/gql/educator/mutations.ts';
import { useEducatorStorage } from '@frontend/hooks/useEducatorStorage.ts';

export type IdentifyNotaryResponse = {
  identifyNotary: IdentifiedNotary;
};

type NotaryIdentificationOutputProps = {
  hideInfoHintBox?: boolean;
  hideText?: boolean;
};

export const NotaryIdentificationOutput = ({
  hideInfoHintBox,
  hideText,
}: NotaryIdentificationOutputProps) => {
  const { storage, updateStorage } = useEducatorStorage();

  const [identifyNotary, { data, loading, error }] =
    useMutation<IdentifyNotaryResponse>(IDENTIFY_NOTARY);

  useEffect(() => {
    const fetchNotary = async () => {
      try {
        const response = await identifyNotary({
          variables: { data: storage.deceasedPersonFormData },
        });
        if (response?.data) {
          updateStorage({
            identifiedNotary: response.data.identifyNotary,
          });
        }
      } catch (err) {
        console.error('Failed to identify notary:', err);
      }
    };

    fetchNotary();
  }, [storage.deceasedPersonFormData, updateStorage, identifyNotary]);

  return (
    <>
      <Box textAlign="center">
        {!hideInfoHintBox && (
          <Box textAlign="left" mb="6">
            <InfoHintBox title="Mohu si vybrat notáře sám?">
              Vybrat si vlastního notáře pro dědické řízením není možné. Notář
              je vždy soudně pověřen vedením dědických řízení dle platného
              rozvru práce.
            </InfoHintBox>
          </Box>
        )}
        {!hideText && (
          <Text mb="8">
            Notářem pověřeným řízením vedením dědického řízení pro daného
            zůstavitele je:
          </Text>
        )}

        {loading && <Spinner color="goldenYellow.500" size="xl" mb="10" />}

        {error && (
          <Alert status="error" mb="10">
            <AlertIcon />
            Omlouváme se, ale notáře nebylo možné identifikovat.
          </Alert>
        )}

        {data && (
          <>
            <Text fontSize="2xl" fontWeight="bold" mb="2">
              {data.identifyNotary.notaryName}
            </Text>
            <Text fontSize="medium" fontWeight="medium" mb="2">
              Zástupný notář: {data.identifyNotary.secondaryNotaryName}
            </Text>
            <Text fontSize="xl" fontWeight="semibold" mb="10">
              {data.identifyNotary.court.name}
            </Text>
          </>
        )}
      </Box>
    </>
  );
};
