import { InfoHintBox } from '@frontend/components/infoHintBox/InfoHintBox';
import { useEducatorState } from '@frontend/pages/educator/hooks/useEducatorState.ts';
import { useEducatorStorage } from '@frontend/pages/educator/hooks/useEducatorStorage.ts';

import { StepQuestion } from './common/StepQuestion.tsx';

export const Step22_QuestionHasSJM = () => {
  const { setState, incrementState } = useEducatorState();
  const { updateStorage } = useEducatorStorage();

  return (
    <StepQuestion
      question="Měli zůstavitel s manželem(kou) uzavřené zúžené společné jmění manželů (SJM)?"
      answers={[
        {
          label: 'Ano',
          action: () => {
            incrementState();
            updateStorage({ hadSMJ: true });
          },
        },
        {
          label: 'Ne',
          action: () => {
            setState(29);
            updateStorage({ hadSMJ: false });
          },
        },
      ]}
    >
      <InfoHintBox title="Co je zúžené společné jmění manželů?">
        Zúžené SJM je dohoda, že některý majetek nebo závazky nebudou společné,
        ale budou patřit jen jednomu z manželů.
      </InfoHintBox>
    </StepQuestion>
  );
};
