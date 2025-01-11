import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { DeceasedPersonFormFields } from '@frontend/components/forms/deceasedPersonForm/DeceasedPersonForm.tsx';
import { IdentifiedNotary } from '@frontend/gql/educator/mutations.ts';
import { AssetFields } from '@frontend/pages/educator/components/assetsDistribution/assetsIdentificationFormSchema.ts';
import { HeirsIdentificationFormFields } from '@frontend/pages/educator/components/assetsDistribution/heirsIdentificatonFormSchema.ts';
import { InheritanceResult } from '@frontend/pages/educator/components/steps/phase3/useInheritanceCalculator.tsx';

export type Result = {
  condition: (resultState: EducatorStorage) => boolean | undefined;
  title: string;
  explanations?: string[];
};

export const results: Result[] = [
  {
    condition: (resultState) => resultState.hadSMJ && resultState.married,
    title: 'Zúžené společné jmění manželů (SJM)',
    explanations: [
      'Pokud bylo SJM zúžené a zůstavitel nabyl během manželství nějaký majetek do výlučného vlastnictví, tak tento majetek bude spadat přímo do pozůstalostního řízení.',
      'Podle toho, zda měli zůstavitel/ka a pozůstalý/á manžel/ka alespoň nějaký majetek v SJM, se nejdříve vypořádá SJM standardním způsobem, kdy je potřeba, aby pozůstalá manželka získala majetek (resp. hodnotu) ve výši 1/2 tohoto majetku.',
    ],
  },
  {
    condition: (resultState) =>
      !resultState.married &&
      !resultState.hadWill &&
      resultState.hadKids &&
      resultState.numberOfKids === 'one',
    title: 'Není závěť - 1 potomek',
    explanations: [
      'Veškerý majetek získává v pozůstalostním řízení tento jediný dědic.',
      'V případě, že by tento potomek nebyl naživu, dědí místo něj jeho potomci.',
    ],
  },
  {
    condition: (resultState) =>
      !resultState.married &&
      !resultState.hadWill &&
      resultState.hadKids &&
      resultState.numberOfKids === 'many',
    title: 'Není závěť - 2 a více potomků',
    explanations: [
      'V tomto případě každému z potomků náleží rovný díl (např. 1/2 pro 2 potomky) hodnoty majetku z pozůstalosti.',
      'Preferovaným způsobem, jak věc vyřešit je tzv. dědická dohoda, kdy je možné si dědické podíly určit odlišným způsobem.',
    ],
  },
  {
    condition: (resultState) =>
      !resultState.married &&
      !resultState.hadWill &&
      !resultState.hadKids &&
      resultState.hadParents &&
      resultState.livedWithSomeone,
    title: 'Není závěť - žádný potomek - rodiče - osoba ve společné domácnosti',
    explanations: [
      'V tomto případě dědí zůstavitelovi rodiče a osoby, které se zůstavitelem žily ve společné domácnosti po dobu alespoň jednoho roku před smrtí, rovným dílem.',
      'Je možné, aby si tito dědicové majetek rozdělili dle dědické dohody i jiným způsobem. ',
    ],
  },
  {
    condition: (resultState) =>
      !resultState.married &&
      !resultState.hadWill &&
      !resultState.hadKids &&
      resultState.hadParents &&
      !resultState.livedWithSomeone,
    title:
      'Není závěť - žádný potomek - rodiče - žádná osoba ve společné domácnosti',
    explanations: [
      'V tomto případě bude rozdělení pozůstalosti probíhat podle dalších zákonných dědických tříd. ',
      'Omlouváme se, ale pro tuto variantu nejsme schopni poskytnout více informací.',
    ],
  },
  {
    condition: (resultState) =>
      !resultState.married &&
      !resultState.hadWill &&
      !resultState.hadKids &&
      !resultState.hadParents &&
      resultState.livedWithSomeone,
    title:
      'Není závěť - žádný potomek - rodiče po smrti - osoba ve společné domácnosti',
    explanations: [
      'V tomto případě budou dědicem majetku v pozůstalostním řízení osoby, které se zůstavitelem žily ve společné domácnosti po dobu alespoň jednoho roku před smrtí.',
    ],
  },
  {
    condition: (resultState) =>
      resultState.married &&
      !resultState.hadSMJ &&
      !resultState.hadWill &&
      resultState.hadKids &&
      resultState.numberOfKids === 'one',
    title: 'SJM - Není závěť - 1 potomek',
    explanations: [
      'Majetek v pozůstalostním řízení se rovným dílem rozdělí mezi pozůstalou manželku a jediného dědice.',
      'Preferovaným způsobem, jak věc vyřešit je dědická dohoda, kdy je možné si dědické podíly určit odlišným způsobem.',
    ],
  },
  {
    condition: (resultState) =>
      resultState.married &&
      !resultState.hadSMJ &&
      !resultState.hadWill &&
      resultState.hadKids &&
      resultState.numberOfKids === 'many',
    title: 'SJM - Není závěť - 2 a více potomků',
    explanations: [
      'Pozůstalé manželce a každému z potomků náleží rovný díl majetku z pozůstalosti (např. v případě manželky a dvou potomků náleží každému 1/3 celkové hodnoty majetku v pozůstalostním řízení).',
      'Preferovaným způsobem, jak věc vyřešit je dědická dohoda, kdy je možné si dědické podíly určit odlišným způsobem.',
    ],
  },
  {
    condition: (resultState) =>
      resultState.married &&
      !resultState.hadSMJ &&
      !resultState.hadWill &&
      !resultState.hadKids &&
      resultState.hadParents &&
      resultState.livedWithSomeone,
    title:
      'SJM - Není závěť - žádný potomek - rodiče - osoba ve společné domácnosti',
    explanations: [
      'V tomto případě dědí pozůstalá manželka, zůstavitelovi rodiče a osoby, které se zůstavitelem žily ve společné domácnosti po dobu alespoň jednoho roku před smrtí, rovným dílem. Pozůstalá manželka ale dědí nejméně jednu polovinu pozůstalosti.',
      'Je možné, aby si tito dědicové majetek rozdělili dle dědické dohody i jiným způsobem.',
    ],
  },
  {
    condition: (resultState) =>
      resultState.married &&
      !resultState.hadSMJ &&
      !resultState.hadWill &&
      !resultState.hadKids &&
      !resultState.hadParents &&
      resultState.livedWithSomeone,
    title:
      'SJM - Není závěť - žádný potomek - rodiče po smrti - osoba ve společné domácnosti',
    explanations: [
      'V tomto případě dědí pozůstalý/á manžel/ka a osoby, které se zůstavitelem žily ve společné domácnosti po dobu alespoň jednoho roku před smrtí.',
      'Pozůstalý/á manžel/ka ale dědí nejméně 1/2 majetku v pozůstalostním řízení.',
    ],
  },
  {
    condition: (resultState) =>
      resultState.married &&
      !resultState.hadSMJ &&
      !resultState.hadWill &&
      !resultState.hadKids &&
      resultState.hadParents &&
      !resultState.livedWithSomeone,
    title:
      'SJM - Není závěť - žádný potomek - rodiče po smrti - osoba ve společné domácnosti',
    explanations: [
      'V tomto případě bude dědicem veškerého majetku v pozůstalostním řízení pozůstalá manželka.',
    ],
  },
  // ve figjamu chybi varianta kdyz na vse odpovis ne
];

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
      name: 'edu-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
