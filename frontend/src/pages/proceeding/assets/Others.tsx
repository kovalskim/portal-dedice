import { TextareaField } from '@frontend/components/forms/fields/TextareaField';

import { AssetList } from './AssetList';

export const Others = () => {
  return (
    <AssetList
      heading="Jiné"
      placeholder="Zatím nebylo nic přidáno"
      empty={{ description: '' }}
      nameOfArray="others"
    >
      {(index) => (
        <TextareaField
          name={'others[' + index + '][description]'}
          placeholder="Např. jachta, vrtulník, ponorka"
          variant={'filled'}
          noOfLines={3}
        />
      )}
    </AssetList>
  );
};
