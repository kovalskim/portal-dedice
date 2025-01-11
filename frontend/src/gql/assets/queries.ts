import gql from 'graphql-tag';

export const ASSETS_BY_PROCEEDING_ID = gql`
  query GetAssetById($proceedingId: Int!) {
    getAssetById(proceedingId: $proceedingId) {
      generalInfo {
        lastModified
        modifiedBy
      }
      financialInstruments {
        selectedBank
      }
      businessParticipations {
        ico
      }
      cars {
        brand
        registrationYear
        typeDetail
      }
      valuables {
        description
      }
      others {
        description
      }
    }
  }
`;

export interface Assets {
  lastModified: Date;
  modifiedBy: number;
}

export interface FinancialInstruments {
  selectedBank: string;
}

export interface BusinessParticipation {
  ico: string;
}

export interface Car {
  brand: string;
  registrationYear: number;
  typeDetail: string;
}

export interface Valuable {
  id: number;
  assetId: number;
  description: string;
}

export interface Other {
  description: string;
}

export interface AssetsAll {
  generalInfo: Assets;
  financialInstruments: FinancialInstruments[];
  businessParticipations: BusinessParticipation[];
  cars: Car[];
  valuables: Valuable[];
  others: Other[];
}
