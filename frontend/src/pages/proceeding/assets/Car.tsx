import { Flex } from '@chakra-ui/react';
import { useOutletContext } from 'react-router-dom';

import { FancySelectField } from '@frontend/components/forms/fields/FancySelectField';
import { InputField } from '@frontend/components/forms/fields/InputField';
import { PROCEEDING_PHASES } from '@frontend/pages/proceeding/constants.ts';
import { OutletContextType } from '@frontend/pages/proceeding/overview/ProceedingOverviewPage.tsx';

import { AssetList } from './AssetList';
import { carBrands } from './constants';

export const Cars = () => {
  const { proceeding } = useOutletContext<OutletContextType>();

  return (
    <AssetList
      heading="Auta"
      placeholder="Zatím nebyla přidána žádna auta"
      empty={{ brand: '', registrationYear: 2000, typeDetail: '' }}
      nameOfArray="cars"
    >
      {(index) => (
        <Flex gap={2} wrap="wrap" w="full">
          <Flex w="full" flex={1} gap={2}>
            <FancySelectField
              name={`cars[${index}][brand]`}
              placeholder="Značka"
              options={carBrands.map((val) => ({
                value: val,
                label: val,
              }))}
              variant={'filled'}
              isDisabled={proceeding.phaseId === PROCEEDING_PHASES.FINISHED}
            />
            <InputField
              name={`cars[${index}][registrationYear]`}
              placeholder="Datum první registrace"
              variant={'filled'}
              type="number"
              isDisabled={proceeding.phaseId === PROCEEDING_PHASES.FINISHED}
            />
          </Flex>

          <Flex w="full" flex="grow">
            <InputField
              name={`cars[${index}][typeDetail]`}
              placeholder="Typ a popis vozidla"
              variant={'filled'}
              isDisabled={proceeding.phaseId === PROCEEDING_PHASES.FINISHED}
            />
          </Flex>
        </Flex>
      )}
    </AssetList>
  );
};
