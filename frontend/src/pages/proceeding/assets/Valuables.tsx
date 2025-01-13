import { useOutletContext } from 'react-router-dom';

import { TextareaField } from '@frontend/components/forms/fields/TextareaField';
import { PROCEEDING_PHASES } from '@frontend/pages/proceeding/constants.ts';
import { OutletContextType } from '@frontend/pages/proceeding/overview/ProceedingOverviewPage.tsx';

import { AssetList } from './AssetList';

export const Valuables = () => {
  const { proceeding } = useOutletContext<OutletContextType>();

  return (
    <AssetList
      heading="Cennosti"
      placeholder="Zatím nebyly přidány žádné cennosti"
      empty={{ description: '' }}
      nameOfArray="valuables"
    >
      {(index) => (
        <TextareaField
          name={'valuables[' + index + '][description]'}
          placeholder="Např. hotovost, nebo šperky, obrazy"
          variant={'filled'}
          noOfLines={3}
          isDisabled={proceeding.phaseId === PROCEEDING_PHASES.FINISHED}
        />
      )}
    </AssetList>
  );
};
