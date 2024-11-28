import { create } from 'zustand';

import { NewProceedingFormFields } from '@frontend/pages/userDashboard/components/proceedingModals/NewProceedingForm';

interface MultiStepFormStore {
  step: number;
  setStep: (step: number) => void;
  formData: Partial<NewProceedingFormFields>;
  setFormData: (data: Partial<NewProceedingFormFields>) => void;
  resetFormStore: () => void;
}

export const useNewProceedingFormStore = create<MultiStepFormStore>((set) => ({
  step: 1,
  setStep: (step) => set({ step }),
  formData: {},
  setFormData: (data) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
    })),
  resetFormStore: () =>
    set(() => ({
      step: 1,
      formData: {},
    })),
}));
