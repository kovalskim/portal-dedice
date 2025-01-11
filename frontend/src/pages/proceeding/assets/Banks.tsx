import { FancySelectField } from '@frontend/components/forms/fields/FancySelectField';

import { AssetList } from './AssetList';
import { banks } from './constants';

export const Banks = () => {
  return (
    <AssetList
      heading="Bankovní účty a jiné finanční instrumenty"
      placeholder="Zatím nebyli přidány žádné bankovní účty a jiné finanční instrumenty"
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
        />
      )}
    </AssetList>
  );
};
