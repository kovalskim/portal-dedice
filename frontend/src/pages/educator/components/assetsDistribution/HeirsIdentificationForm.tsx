import { useState } from 'react';
import { Box } from '@chakra-ui/layout';
import { Alert, AlertIcon, Flex, Radio } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { boolean } from 'boolean';
import { SubmitHandler } from 'react-hook-form';

import { CheckboxField } from '@frontend/components/forms/fields/CheckboxField.tsx';
import { RadioGroupField } from '@frontend/components/forms/fields/RadioGroupField.tsx';
import { SelectField } from '@frontend/components/forms/fields/SelectField.tsx';
import { Form } from '@frontend/components/forms/Form.tsx';
import { HAS_HEIRS_OPTIONS } from '@frontend/pages/educator/components/assetsDistribution/constants.ts';
import {
  HeirsIdentificationFormFields,
  heirsIdentificationFormSchema,
} from '@frontend/pages/educator/components/assetsDistribution/heirsIdentificatonFormSchema.ts';

type HeirsIdentificationFormProps = {
  id: string;
  onSubmit: SubmitHandler<HeirsIdentificationFormFields>;
  defaultValues?: Partial<HeirsIdentificationFormFields>;
};

const getBooleanStateValue = (value?: string) =>
  value !== undefined ? boolean(value) : null;

export const HeirsIdentificationForm = ({
  id,
  onSubmit,
  defaultValues,
}: HeirsIdentificationFormProps) => {
  const [heirshipState, setHeirshipState] = useState({
    hasHusbandOrWife: getBooleanStateValue(defaultValues?.hasHusbandOrWife),
    hasChildren: getBooleanStateValue(defaultValues?.hasChildren),
    hasLivingParents: getBooleanStateValue(defaultValues?.hasLivingParents),
    hasHousemate: getBooleanStateValue(defaultValues?.hasHousemate),
    hasSiblings: getBooleanStateValue(defaultValues?.hasSiblings),
  });

  const handleHeirshipStateChange =
    (field: keyof typeof heirshipState) => (val: string) => {
      setHeirshipState((prevState) => ({
        ...prevState,
        [field]: val === HAS_HEIRS_OPTIONS.YES,
      }));
    };

  return (
    <Form
      id={id}
      onSubmit={onSubmit}
      resolver={zodResolver(heirsIdentificationFormSchema)}
      defaultValues={{
        hasHusbandOrWife: defaultValues?.hasHusbandOrWife,
        hasChildren: defaultValues?.hasChildren,
        childrenCount: defaultValues?.childrenCount,
        hasLivingParents: defaultValues?.hasLivingParents,
        hasLivingFather: defaultValues?.hasLivingFather,
        hasLivingMother: defaultValues?.hasLivingMother,
        hasHousemate: defaultValues?.hasHousemate,
        hasSiblings: defaultValues?.hasSiblings,
        siblingsCount: defaultValues?.siblingsCount,
      }}
    >
      <Flex mb={6} justifyContent="center" direction="row">
        <Flex direction="column">
          <RadioGroupField
            name="hasChildren"
            label="Má zůstavitel přímé potomky?"
            onChange={handleHeirshipStateChange('hasChildren')}
          >
            <Flex gap={4} justifyContent="center">
              <Radio value={HAS_HEIRS_OPTIONS.YES}>Ano</Radio>
              <Radio value={HAS_HEIRS_OPTIONS.NO}>Ne</Radio>
            </Flex>
          </RadioGroupField>
          {heirshipState.hasChildren! && (
            <SelectField
              name="childrenCount"
              label=""
              size="sm"
              placeholder="Zvolte počet potomků"
              mt={3}
            >
              {[...Array(10).keys()].map((num) => (
                <option value={num + 1} key={num + 1}>
                  {num + 1}
                </option>
              ))}
            </SelectField>
          )}
        </Flex>
      </Flex>
      <Flex mb={6} justifyContent="center">
        <Box>
          <RadioGroupField
            name="hasHusbandOrWife"
            label="Má zůstavitel manžela/manželku?"
            onChange={handleHeirshipStateChange('hasHusbandOrWife')}
          >
            <Flex gap={4} justifyContent="center">
              <Radio value={HAS_HEIRS_OPTIONS.YES}>Ano</Radio>
              <Radio value={HAS_HEIRS_OPTIONS.NO}>Ne</Radio>
            </Flex>
          </RadioGroupField>
        </Box>
      </Flex>
      {heirshipState?.hasChildren === false && (
        <>
          <Flex mb={6} justifyContent="center">
            <Flex direction="column">
              <RadioGroupField
                name="hasLivingParents"
                label="Má zůstavitel žijící rodiče?"
                onChange={handleHeirshipStateChange('hasLivingParents')}
              >
                <Flex gap={4} justifyContent="center">
                  <Radio value={HAS_HEIRS_OPTIONS.YES}>Ano</Radio>
                  <Radio value={HAS_HEIRS_OPTIONS.NO}>Ne</Radio>
                </Flex>
              </RadioGroupField>
              {heirshipState?.hasLivingParents === true && (
                <Flex direction="column" mt={3} gap={1}>
                  <CheckboxField name="hasLivingFather" label="Otec" />
                  <CheckboxField name="hasLivingMother" label="Matka" />
                </Flex>
              )}
            </Flex>
          </Flex>
          <Flex mb={6} justifyContent="center" direction="column">
            <RadioGroupField
              name="hasHousemate"
              label="Má zůstavitel/ka osobu, která s ním žije alespoň 1 rok ve společné domácnosti?"
              onChange={handleHeirshipStateChange('hasHousemate')}
            >
              <Flex gap={4} justifyContent="center">
                <Radio value={HAS_HEIRS_OPTIONS.YES}>Ano</Radio>
                <Radio value={HAS_HEIRS_OPTIONS.NO}>Ne</Radio>
              </Flex>
            </RadioGroupField>
            <Alert
              colorScheme="goldenYellow"
              fontSize="sm"
              py={1}
              mt={2}
              alignItems="center"
              justifyContent="center"
            >
              <AlertIcon boxSize="4" />
              Za osobu žijící ve společné domácnosti je považován například
              partner(ka).
            </Alert>
          </Flex>
        </>
      )}
      {heirshipState?.hasChildren === false &&
        heirshipState?.hasHusbandOrWife === false &&
        heirshipState.hasLivingParents === false && (
          <Flex mb={6} justifyContent="center">
            <Flex direction="column">
              <RadioGroupField
                name="hasSiblings"
                label="Má zůstavitel/ka žijící sourozence?"
                onChange={handleHeirshipStateChange('hasSiblings')}
              >
                <Flex gap={4} justifyContent="center">
                  <Radio value={HAS_HEIRS_OPTIONS.YES}>Ano</Radio>
                  <Radio value={HAS_HEIRS_OPTIONS.NO}>Ne</Radio>
                </Flex>
              </RadioGroupField>
              {heirshipState?.hasSiblings === true && (
                <SelectField
                  name="siblingsCount"
                  label=""
                  size="sm"
                  placeholder="Zvolte počet sourozenců"
                  mt={2}
                >
                  {[...Array(10).keys()].map((num) => (
                    <option value={num + 1} key={num + 1}>
                      {num + 1}
                    </option>
                  ))}
                </SelectField>
              )}
            </Flex>
          </Flex>
        )}
    </Form>
  );
};
