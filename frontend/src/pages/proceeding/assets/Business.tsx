import { useOutletContext } from 'react-router-dom';

import { InputField } from '@frontend/components/forms/fields/InputField';
import { PROCEEDING_PHASES } from '@frontend/pages/proceeding/constants.ts';
import { OutletContextType } from '@frontend/pages/proceeding/overview/ProceedingOverviewPage.tsx';

import { AssetList } from './AssetList';

export const Business = () => {
  const { proceeding } = useOutletContext<OutletContextType>();

  return (
    <AssetList
      heading="Účast v obchodních společnostech"
      placeholder="Zatím nebyly přidány žádné účasti v obchodních společnostech"
      empty={{ ico: '' }}
      nameOfArray="businessParticipations"
    >
      {(index) => (
        <InputField
          name={'businessParticipations[' + index + '][ico]'}
          placeholder="IČO"
          variant={'filled'}
          isDisabled={proceeding.phaseId === PROCEEDING_PHASES.FINISHED}
        />
      )}
    </AssetList>
  );
};
