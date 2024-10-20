import { NumberedStepper } from '@frontend/components';

type SecondPhaseStepperProps = {
  activeStep: number;
};

export const SecondPhaseStepper = ({ activeStep }: SecondPhaseStepperProps) => {
  return (
    <NumberedStepper
      steps={[
        { title: 'Úvodní fáze' },
        { title: 'Předběžné šetření' },
        { title: 'Pozůstalostní řízení' },
      ]}
      activeStep={activeStep}
      hideLabels
    />
  );
};
