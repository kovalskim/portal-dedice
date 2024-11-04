import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { IdentifiedNotary } from '@frontend/gql/educator/mutations.ts';
import { DeceasedPersonFormFields } from '@frontend/pages/educator/components/notary-identification/DeceasedPersonForm.tsx';

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
};

const defaultEducatorStorage: EducatorStorage = {
  deceasedPersonFormData: undefined,
  identifiedNotary: undefined,
};

type State = {
  storage: EducatorStorage;
};

type Action = {
  setStorage: (newStorage: EducatorStorage) => void;
  updateStorage: (newStorage: EducatorStorage) => void;
  resetStorage: () => void;
};

type EducatorStorageProps = State & Action;

export const useEducatorStorage = create(
  persist<EducatorStorageProps>(
    (set) => ({
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
    }),
    {
      name: 'edu-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
