import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type EducatorState = {
  currentStep: number;
  prevSteps: number[];
};

const defaultEducatorState: EducatorState = {
  currentStep: 0,
  prevSteps: [],
};

type Action = {
  setState: (newCurrentStep: number, newPrevSteps?: number[]) => void;
  setPrevState: () => void;
  incrementState: () => void;
  resetState: () => void;
};

type State = {
  state: EducatorState;
};

type EducatorStateProps = State & Action;

export const useEducatorState = create(
  persist<EducatorStateProps>(
    (set) => ({
      state: defaultEducatorState,
      setState: (newCurrentStep: number, newPrevSteps?: number[]) => {
        set(({ state }: EducatorStateProps) => {
          return {
            state: {
              currentStep: newCurrentStep,
              prevSteps: newPrevSteps
                ? newPrevSteps
                : [...state.prevSteps, state.currentStep],
            },
          };
        });
      },
      incrementState: () => {
        set(({ state }: EducatorStateProps) => {
          return {
            state: {
              currentStep: state.currentStep + 1,
              prevSteps: [...state.prevSteps, state.currentStep],
            },
          };
        });
      },
      setPrevState: () => {
        set(({ state }: EducatorStateProps) => {
          const newCurrentStep = state.prevSteps.pop();
          return {
            state: {
              currentStep: newCurrentStep === undefined ? -1 : newCurrentStep,
              prevSteps: state.prevSteps,
            },
          };
        });
      },
      resetState: () => set(() => ({ state: defaultEducatorState })),
    }),
    {
      name: 'edu-state',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
