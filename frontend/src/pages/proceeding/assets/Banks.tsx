import { useOutletContext } from 'react-router-dom';

import { FancySelectField } from '@frontend/components/forms/fields/FancySelectField';
import { PROCEEDING_PHASES } from '@frontend/pages/proceeding/constants.ts';
import { OutletContextType } from '@frontend/pages/proceeding/overview/ProceedingOverviewPage.tsx';

import { AssetList } from './AssetList';
import { banks } from './constants';

export const Banks = () => {
  const { proceeding } = useOutletContext<OutletContextType>();

  return (
    <AssetList
      heading="Bankovní účty a jiné finanční instrumenty"
      placeholder="Zatím nebyly přidány žádné bankovní účty a jiné finanční instrumenty"
      empty={{ selectedBank: '' }}
      nameOfArray="financialInstruments"
    >
      {(index) => (
        <FancySelectField
          name={'financialInstruments[' + index + '][selectedBank]'}
          placeholder="Instituce"
          options={banks.map((val) => ({
            value: val,
            label: val,
          }))}
          variant={'filled'}
          isDisabled={proceeding.phaseId === PROCEEDING_PHASES.FINISHED}
        />
      )}
    </AssetList>
  );
};
