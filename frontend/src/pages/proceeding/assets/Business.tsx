import { InputField } from '@frontend/components/forms/fields/InputField';

import { AssetList } from './AssetList';

export const Business = () => {
  return (
    <AssetList
      heading="Účast v obchodních společnostech"
      placeholder="Zatím nebyli přidány žádné účasti v obchodních společnostech"
      empty={{ ico: '' }}
      nameOfArray="businessParticipations"
    >
      {(index) => (
        <InputField
          name={'businessParticipations[' + index + '][ico]'}
          placeholder="IČO"
          variant={'filled'}
        />
      )}
    </AssetList>
  );
};
