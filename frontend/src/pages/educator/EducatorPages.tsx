import { Box } from '@chakra-ui/react';

import { Step00_Intro } from '@frontend/pages/educator/components/steps/phase0-notaryIdentification/Step00_Intro.tsx';
import { Step01_NotaryIdentifInput } from '@frontend/pages/educator/components/steps/phase0-notaryIdentification/Step01_NotaryIdentifInput.tsx';
import { Step02_NotaryIdentifOutput } from '@frontend/pages/educator/components/steps/phase0-notaryIdentification/Step02_NotaryIdentifOutput.tsx';
import { Step10_EnterQuestion } from '@frontend/pages/educator/components/steps/phase1-processInfo/Step10_EnterQuestion.tsx';
import { Step11_IntroPhaseInfo } from '@frontend/pages/educator/components/steps/phase1-processInfo/Step11_IntroPhaseInfo.tsx';
import { Step12_InvestigPhaseInfo } from '@frontend/pages/educator/components/steps/phase1-processInfo/Step12_InvestigPhaseInfo.tsx';
import { Step13_InvestigPhaseMeaning } from '@frontend/pages/educator/components/steps/phase1-processInfo/Step13_InvestigPhaseMeaning.tsx';
import { Step14_InvestigPhaseWhatToBring } from '@frontend/pages/educator/components/steps/phase1-processInfo/Step14_InvestigPhaseWhatToBring.tsx';
import { Step15_InvestigPhaseWhatHappens } from '@frontend/pages/educator/components/steps/phase1-processInfo/Step15_InvestigPhaseWhatHappens.tsx';
import { Step16_InheritProcedurePhaseInfo } from '@frontend/pages/educator/components/steps/phase1-processInfo/Step16_InheritProcedurePhaseInfo.tsx';
import { Step27_QuestionHasParents } from '@frontend/pages/educator/components/steps/phase2-resolutionOfInheritance/21-no-ans/24-no-ans/25-no-ans/Step27_QuestionHasParents.tsx';
import { Step28_QuestionHasHousemate } from '@frontend/pages/educator/components/steps/phase2-resolutionOfInheritance/21-no-ans/24-no-ans/25-no-ans/Step28_QuestionHasHousemate.tsx';
import { Step25_QuestionHasChildren } from '@frontend/pages/educator/components/steps/phase2-resolutionOfInheritance/21-no-ans/24-no-ans/Step25_QuestionHasChildren.tsx';
import { Step26_QuestionChildrenCount } from '@frontend/pages/educator/components/steps/phase2-resolutionOfInheritance/21-no-ans/24-no-ans/Step26_QuestionChildrenCount.tsx';
import { Step24_QuestionTestament } from '@frontend/pages/educator/components/steps/phase2-resolutionOfInheritance/21-no-ans/Step24_QuestionTestament.tsx';
import { Step29_SJMInfo } from '@frontend/pages/educator/components/steps/phase2-resolutionOfInheritance/22-no-ans/Step29_SJMInfo.tsx';
import { Step210_SJMDealInfo } from '@frontend/pages/educator/components/steps/phase2-resolutionOfInheritance/22-no-ans/Step210_SJMDealInfo.tsx';
import { Step20_EnterQuestion } from '@frontend/pages/educator/components/steps/phase2-resolutionOfInheritance/Step20_EnterQuestion.tsx';
import { Step21_QuestionHasSpouse } from '@frontend/pages/educator/components/steps/phase2-resolutionOfInheritance/Step21_QuestionHasSpouse.tsx';
import { Step22_QuestionHasSJM } from '@frontend/pages/educator/components/steps/phase2-resolutionOfInheritance/Step22_QuestionHasSJM.tsx';
import { Step23_ResolutionOfInheritance } from '@frontend/pages/educator/components/steps/phase2-resolutionOfInheritance/Step23_ResolutionOfInheritance.tsx';
import { Step211_QuestionHeirsAgreement } from '@frontend/pages/educator/components/steps/phase2-resolutionOfInheritance/Step211_QuestionHeirsAgreement.tsx';
import { Step212_HeirsAgreementInfo } from '@frontend/pages/educator/components/steps/phase2-resolutionOfInheritance/Step212_HeirsAgreementInfo.tsx';
import { Step30_EnterQuestion } from '@frontend/pages/educator/components/steps/phase3-assetsDistribution/Step30_EnterQuestion.tsx';
import { Step31_HeirsIdentification } from '@frontend/pages/educator/components/steps/phase3-assetsDistribution/Step31_HeirsIdentification.tsx';
import { Step32_AssetsIdentification } from '@frontend/pages/educator/components/steps/phase3-assetsDistribution/Step32_AssetsIdentification.tsx';
import { Step33_Result } from '@frontend/pages/educator/components/steps/phase3-assetsDistribution/Step33_Result.tsx';
import { StepNotFound } from '@frontend/pages/educator/components/steps/StepNotFound.tsx';
import { useEducatorState } from '@frontend/pages/educator/hooks/useEducatorState.ts';

import { Step40_Summary } from './components/steps/phase4-summary/Step40_Summary.tsx';
import { Step41_Ending } from './components/steps/phase4-summary/Step41_Ending.tsx';

type Step = {
  index: number;
  stepEl: () => JSX.Element;
};

// step naming convention: StepXY where X = index of phase, Y = index of step in phase + _Description
const steps: Step[] = [
  { index: 0, stepEl: Step00_Intro },
  { index: 1, stepEl: Step01_NotaryIdentifInput },
  { index: 2, stepEl: Step02_NotaryIdentifOutput },
  { index: 10, stepEl: Step10_EnterQuestion },
  { index: 11, stepEl: Step11_IntroPhaseInfo },
  { index: 12, stepEl: Step12_InvestigPhaseInfo },
  { index: 13, stepEl: Step13_InvestigPhaseMeaning },
  { index: 14, stepEl: Step14_InvestigPhaseWhatToBring },
  { index: 15, stepEl: Step15_InvestigPhaseWhatHappens },
  { index: 16, stepEl: Step16_InheritProcedurePhaseInfo },
  { index: 20, stepEl: Step20_EnterQuestion },
  { index: 21, stepEl: Step21_QuestionHasSpouse },
  { index: 22, stepEl: Step22_QuestionHasSJM },
  { index: 23, stepEl: Step23_ResolutionOfInheritance },
  { index: 24, stepEl: Step24_QuestionTestament },
  { index: 25, stepEl: Step25_QuestionHasChildren },
  { index: 26, stepEl: Step26_QuestionChildrenCount },
  { index: 27, stepEl: Step27_QuestionHasParents },
  { index: 28, stepEl: Step28_QuestionHasHousemate },
  { index: 29, stepEl: Step29_SJMInfo },
  { index: 210, stepEl: Step210_SJMDealInfo },
  { index: 211, stepEl: Step211_QuestionHeirsAgreement },
  { index: 212, stepEl: Step212_HeirsAgreementInfo },
  { index: 30, stepEl: Step30_EnterQuestion },
  { index: 31, stepEl: Step31_HeirsIdentification },
  { index: 32, stepEl: Step32_AssetsIdentification },
  { index: 33, stepEl: Step33_Result },
  { index: 40, stepEl: Step40_Summary },
  { index: 41, stepEl: Step41_Ending },
];

const findStepEl = (stepIndex: number) => {
  return steps.find((val) => val.index === stepIndex)?.stepEl;
};

export const EducatorPage = () => {
  const { state } = useEducatorState();

  const CurrentStep = findStepEl(state.currentStep) || StepNotFound;

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100%"
    >
      <CurrentStep />
    </Box>
  );
};
