import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { DeceasedPersonFormFields } from '@frontend/components/forms/deceasedPersonForm/DeceasedPersonForm.tsx';
import { IdentifiedNotary } from '@frontend/gql/educator/mutations.ts';
import { AssetFields } from '@frontend/pages/educator/components/assetsDistribution/assetsIdentificationFormSchema.ts';
import { HeirsIdentificationFormFields } from '@frontend/pages/educator/components/assetsDistribution/heirsIdentificatonFormSchema.ts';
import {
  educatorStoragePeristName,
  results,
} from '@frontend/pages/educator/hooks/constants.ts';
import { InheritanceResult } from '@frontend/pages/educator/hooks/useInheritanceCalculator.ts';

export type Result = {
  condition: (resultState: EducatorStorage) => boolean | undefined;
  title: string;
  explanations?: string[];
};

export type EducatorStorage = {
  deceasedPersonFormData?: DeceasedPersonFormFields;
  identifiedNotary?: IdentifiedNotary;
  married?: boolean;
  hadSMJ?: boolean;
  hadWill?: boolean;
  hadKids?: boolean;
  hadParents?: boolean;
  livedWithSomeone?: boolean;
  numberOfKids?: 'one' | 'many';
  assetsDistribution?: {
    heirs?: HeirsIdentificationFormFields;
    assets?: AssetFields[];
  };
  assetsDistributionResult?: InheritanceResult;
};

const defaultEducatorStorage: EducatorStorage = {};

type State = {
  storage: EducatorStorage;
};

type Action = {
  setStorage: (newStorage: EducatorStorage) => void;
  updateStorage: (newStorage: EducatorStorage) => void;
  resetStorage: () => void;
  getResult: () => Result | undefined;
};

type EducatorStorageProps = State & Action;

export const useEducatorStorage = create(
  persist<EducatorStorageProps>(
    (set, get) => ({
      storage: defaultEducatorStorage,
      setStorage: (newStorage: EducatorStorage) => {
        set(() => {
          return {
            storage: newStorage,
          };
        });
      },
      updateStorage: (newStorage: EducatorStorage) => {
        set(({ storage }: EducatorStorageProps) => {
          return {
            storage: {
              ...storage,
              ...newStorage,
            },
          };
        });
      },
      resetStorage: () => set(() => ({ storage: defaultEducatorStorage })),
      getResult: () => results.find((val) => val.condition(get().storage)),
    }),
    {
      name: educatorStoragePeristName,
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
