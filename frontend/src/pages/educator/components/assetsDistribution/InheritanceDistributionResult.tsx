import { Divider } from '@chakra-ui/icons';
import { Box } from '@chakra-ui/layout';
import { Alert, AlertIcon, Flex, Stack, Text } from '@chakra-ui/react';

import { HeirsIdentificationFormFields } from '@frontend/pages/educator/components/assetsDistribution/heirsIdentificatonFormSchema.ts';
import {
  HEIR_TYPES,
  InheritanceResult,
} from '@frontend/pages/educator/hooks/useInheritanceCalculator.ts';
import { formatPrice, toBoolean } from '@frontend/utils/generalUtil.ts';

type AssetsDistributionResultProps = {
  heirs: HeirsIdentificationFormFields;
  result: InheritanceResult;
};

export const InheritanceDistributionResult = ({
  heirs,
  result,
}: AssetsDistributionResultProps) => {
  return (
    <Box p={8} borderWidth="1px" borderRadius="md" boxShadow="sm">
      <Stack direction="column">
        {toBoolean(heirs?.hasHusbandOrWife) && (
          <>
            <Stack spacing={4}>
              <Flex justifyContent="space-between" gap={20}>
                <Text fontSize="lg" fontWeight="bold">
                  Hodnota SJM
                </Text>
                <Text fontSize="lg" fontWeight="bold" color="goldenYellow.700">
                  {formatPrice(result.SJMTotalValue)}
                </Text>
              </Flex>
              <Flex justifyContent="space-between" gap={20}>
                <Text fontWeight="medium">
                  Pozůstalý/á manžel/ka by měl z titulu vypořádání SJM dostat:
                </Text>
                <Text fontWeight="medium">
                  {formatPrice(result.spouseValue)}
                </Text>
              </Flex>
            </Stack>
            <Divider my={4} />
          </>
        )}
        <Stack spacing={4}>
          <Flex justifyContent="space-between" gap={20}>
            <Text fontSize="lg" fontWeight="bold">
              Hodnota pozůstalosti
            </Text>
            <Text fontSize="lg" fontWeight="bold" color="goldenYellow.700">
              {formatPrice(result.inheritanceTotalValue)}
            </Text>
          </Flex>
          {result.inheritanceValues.length !== 0 ? (
            result.inheritanceValues.map((value) => (
              <Flex justifyContent="space-between" gap={20} key={value.id}>
                <Text fontWeight="medium">
                  Dědic {value.id + 1} ({value.type}
                  {value.type === HEIR_TYPES.CHILD && ' ' + value.seq}
                  {value.type === HEIR_TYPES.SIBLING && ' ' + value.seq}) má z
                  pozůstalosti nárok na:
                </Text>
                <Text fontWeight="medium">{formatPrice(value.value)}</Text>
              </Flex>
            ))
          ) : (
            <Alert status="warning">
              <AlertIcon />
              Není možné určit podíly v rámci rozdělení pozůstalosti.
            </Alert>
          )}
        </Stack>
      </Stack>
    </Box>
  );
};
