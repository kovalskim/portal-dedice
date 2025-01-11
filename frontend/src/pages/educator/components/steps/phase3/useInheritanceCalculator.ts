import { boolean } from 'boolean';

import { AssetFields } from '@frontend/pages/educator/components/assetsDistribution/assetsIdentificationFormSchema.ts';
import { HeirsIdentificationFormFields } from '@frontend/pages/educator/components/assetsDistribution/heirsIdentificatonFormSchema.ts';

export const HEIR_TYPES = {
  SPOUSE: 'manžel/ka',
  CHILD: 'dítě',
  FATHER: 'otec',
  MOTHER: 'matka',
  SIBLING: 'sourozenec',
  HOUSEMATE: 'osoba ve společné domácnosti',
};

export type InheritanceResult = {
  SJMTotalValue: number;
  inheritanceTotalValue: number;
  spouseValue: number;
  inheritanceValues: {
    id: number;
    type: string;
    seq?: number;
    value: number;
  }[];
};

export const useInheritanceCalculator = (
  heirs: HeirsIdentificationFormFields | null,
  assets: AssetFields[] | null,
): { result: InheritanceResult } => {
  const calculateSJMValue = (
    hasHusbandOrWife: boolean,
    assets: AssetFields[] | null,
  ): number => {
    if (!boolean(hasHusbandOrWife)) return 0;
    if (!assets) return 0;
    return assets
      .filter((asset) => asset.SJM)
      .reduce((total, asset) => total + asset.value, 0);
  };

  const calculateTotalInheritanceValue = (
    SJMValue: number,
    assets: AssetFields[] | null,
  ): number => {
    if (!assets) return 0;
    const inheritance = assets
      .filter((asset) => !asset.SJM)
      .reduce((total, asset) => total + asset.value, 0);
    return inheritance + SJMValue / 2;
  };

  const calculateSpouseValue = (hasSpouse: boolean, SJMValue: number) => {
    if (!hasSpouse) return 0;
    return SJMValue / 2;
  };

  const calculateLivingParentsCount = (
    hasLivingMother?: boolean,
    hasLivingFather?: boolean,
  ) => {
    return Number(hasLivingMother ?? false) + Number(hasLivingFather ?? false);
  };

  const calculateInheritanceValues = (
    totalValue: number,
    heirs: HeirsIdentificationFormFields | null,
  ) => {
    if (!heirs) return [];
    const {
      hasHusbandOrWife,
      hasChildren,
      childrenCount = 0,
      hasLivingParents,
      hasLivingMother,
      hasLivingFather,
      hasHousemate,
      hasSiblings,
      siblingsCount = 0,
    } = heirs;

    const result: {
      id: number;
      type: string;
      value: number;
      seq?: number;
    }[] = [];

    // heirs combinations:
    let idCounter = 0;
    if (
      boolean(hasHusbandOrWife) &&
      boolean(hasChildren) &&
      childrenCount > 0
    ) {
      // spouse and children
      const share = totalValue / (1 + childrenCount);
      result.push({ id: idCounter++, type: HEIR_TYPES.SPOUSE, value: share });
      for (let i = 0; i < childrenCount; i++) {
        result.push({
          id: idCounter++,
          type: HEIR_TYPES.CHILD,
          seq: i + 1,
          value: share,
        });
      }
    } else if (boolean(hasChildren) && childrenCount > 0) {
      // only children
      const share = totalValue / childrenCount;
      for (let i = 0; i < childrenCount; i++) {
        result.push({
          id: idCounter++,
          type: HEIR_TYPES.CHILD,
          seq: i + 1,
          value: share,
        });
      }
    } else if (
      boolean(hasHusbandOrWife) &&
      !boolean(hasChildren) &&
      !boolean(hasLivingParents) &&
      !boolean(hasHousemate)
    ) {
      // only spouse
      result.push({
        id: idCounter++,
        type: HEIR_TYPES.SPOUSE,
        value: totalValue,
      });
    } else if (
      // only parents
      boolean(hasLivingParents) &&
      !boolean(hasHusbandOrWife) &&
      !boolean(hasChildren) &&
      !boolean(hasHousemate)
    ) {
      const parentsCount = calculateLivingParentsCount(
        hasLivingMother,
        hasLivingFather,
      );
      const share = totalValue / parentsCount;
      if (boolean(hasLivingMother))
        result.push({
          id: idCounter++,
          type: HEIR_TYPES.MOTHER,
          value: share,
        });
      if (boolean(hasLivingFather))
        result.push({
          id: idCounter++,
          type: HEIR_TYPES.FATHER,
          value: share,
        });
    } else if (
      boolean(hasHousemate) &&
      !boolean(hasChildren) &&
      !boolean(hasHusbandOrWife) &&
      !boolean(hasLivingParents) &&
      !boolean(hasSiblings)
    ) {
      // only housemate
      result.push({
        id: idCounter++,
        type: HEIR_TYPES.HOUSEMATE,
        value: totalValue,
      });
    } else if (
      boolean(hasLivingParents) &&
      boolean(hasHusbandOrWife) &&
      !boolean(hasChildren) &&
      !boolean(hasHousemate)
    ) {
      // spouse + parents
      result.push({
        id: idCounter++,
        type: HEIR_TYPES.SPOUSE,
        value: totalValue / 2,
      });
      const parentsCount = calculateLivingParentsCount(
        hasLivingMother,
        hasLivingFather,
      );
      const remaining = totalValue / 2;
      if (boolean(hasLivingMother))
        result.push({
          id: idCounter++,
          type: HEIR_TYPES.MOTHER,
          value: remaining / parentsCount,
        });
      if (boolean(hasLivingFather))
        result.push({
          id: idCounter++,
          type: HEIR_TYPES.FATHER,
          value: remaining / parentsCount,
        });
    } else if (
      boolean(hasHusbandOrWife) &&
      boolean(hasHousemate) &&
      !boolean(hasChildren) &&
      !boolean(hasLivingParents)
    ) {
      // spouse + housemate
      const share = totalValue / 2;
      result.push({ id: idCounter++, type: HEIR_TYPES.SPOUSE, value: share });
      result.push({
        id: idCounter++,
        type: HEIR_TYPES.HOUSEMATE,
        value: share,
      });
    } else if (
      boolean(hasHusbandOrWife) &&
      boolean(hasHousemate) &&
      boolean(hasLivingParents) &&
      !boolean(hasChildren)
    ) {
      // spouse + parents + housemate
      result.push({
        id: idCounter++,
        type: HEIR_TYPES.SPOUSE,
        value: totalValue / 2,
      });
      const parentsCount = calculateLivingParentsCount(
        hasLivingMother,
        hasLivingFather,
      );
      let remaining = totalValue / 2;
      const housemateValue = remaining / 3;
      result.push({
        id: idCounter++,
        type: HEIR_TYPES.HOUSEMATE,
        value: housemateValue,
      });
      remaining -= housemateValue;
      if (boolean(hasLivingMother))
        result.push({
          id: idCounter++,
          type: HEIR_TYPES.MOTHER,
          value: remaining / parentsCount,
        });
      if (boolean(hasLivingFather))
        result.push({
          id: idCounter++,
          type: HEIR_TYPES.FATHER,
          value: remaining / parentsCount,
        });
    } else if (
      boolean(hasLivingParents) &&
      boolean(hasHousemate) &&
      !boolean(hasHusbandOrWife) &&
      !boolean(hasChildren)
    ) {
      // parents + housemate
      const share = totalValue / 3;
      result.push({
        id: idCounter++,
        type: HEIR_TYPES.HOUSEMATE,
        value: share,
      });
      let remaining = totalValue - share;
      const parentsCount = calculateLivingParentsCount(
        hasLivingMother,
        hasLivingFather,
      );
      if (boolean(hasLivingMother))
        result.push({
          id: idCounter++,
          type: HEIR_TYPES.MOTHER,
          value: remaining / parentsCount,
        });
      if (boolean(hasLivingFather))
        result.push({
          id: idCounter++,
          type: HEIR_TYPES.FATHER,
          value: remaining / parentsCount,
        });
    } else if (
      boolean(hasSiblings) &&
      siblingsCount > 0 &&
      !boolean(hasChildren) &&
      !boolean(hasHusbandOrWife) &&
      !boolean(hasLivingParents) &&
      !boolean(hasHousemate)
    ) {
      // only siblings
      const share = totalValue / siblingsCount;
      for (let i = 0; i < siblingsCount; i++) {
        result.push({
          id: idCounter++,
          type: HEIR_TYPES.SIBLING,
          seq: i + 1,
          value: share,
        });
      }
    } else if (
      boolean(hasSiblings) &&
      siblingsCount > 0 &&
      boolean(hasHousemate) &&
      !boolean(hasChildren) &&
      !boolean(hasHusbandOrWife) &&
      !boolean(hasLivingParents)
    ) {
      // siblings + housemate
      const share = totalValue / (siblingsCount + 1);
      for (let i = 0; i < siblingsCount; i++) {
        result.push({
          id: idCounter++,
          type: HEIR_TYPES.SIBLING,
          seq: i + 1,
          value: share,
        });
      }
      result.push({
        id: idCounter++,
        type: HEIR_TYPES.HOUSEMATE,
        value: share,
      });
    }
    return result;
  };

  const SJMTotalValue = calculateSJMValue(
    boolean(heirs?.hasHusbandOrWife),
    assets,
  );
  const inheritanceTotalValue = calculateTotalInheritanceValue(
    SJMTotalValue,
    assets,
  );
  const spouseValue = calculateSpouseValue(
    boolean(heirs?.hasHusbandOrWife),
    SJMTotalValue,
  );
  const inheritanceValues = calculateInheritanceValues(
    inheritanceTotalValue,
    heirs,
  );

  return {
    result: {
      SJMTotalValue,
      inheritanceTotalValue,
      spouseValue,
      inheritanceValues,
    },
  };
};
