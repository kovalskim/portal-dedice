import { useOutletContext } from 'react-router-dom';

import { TextareaField } from '@frontend/components/forms/fields/TextareaField';
import { PROCEEDING_PHASES } from '@frontend/pages/proceeding/constants.ts';
import { OutletContextType } from '@frontend/pages/proceeding/overview/ProceedingOverviewPage.tsx';

import { AssetList } from './AssetList';

export const Others = () => {
  const { proceeding } = useOutletContext<OutletContextType>();

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
          isDisabled={proceeding.phaseId === PROCEEDING_PHASES.FINISHED}
        />
      )}
    </AssetList>
  );
};
