import { TextareaField } from '@frontend/components/forms/fields/TextareaField';

import { AssetList } from './AssetList';

export const Valuables = () => {
  return (
    <AssetList
      heading="Cennosti"
      placeholder="Zatím nebyli přidány žádné cennosti"
      empty={{ description: '' }}
      nameOfArray="valuables"
    >
      {(index) => (
        <TextareaField
          name={'valuables[' + index + '][description]'}
          placeholder="Např. hotovost, nebo šperky, obrazy"
          variant={'filled'}
          noOfLines={3}
        />
      )}
    </AssetList>
  );
};
