import { gql } from '@apollo/client';

export const CREATE_OR_UPDATE_ASSET = gql`
  mutation CreateOrUpdateAsset(
    $proceedingId: Int!
    $data: CreateAssetsAllInput!
  ) {
    createOrUpdateAsset(proceedingId: $proceedingId, data: $data)
  }
`;

interface FinancialInstrument {
  selectedBank: string;
}

interface BusinessParticipation {
  ico: string;
}

interface Car {
  brand: string;

  registrationYear: number;

  typeDetail: string;
}

interface Valuable {
  description: string;
}

interface Other {
  description: string;
}

export interface CreateAssetsAll {
  financialInstruments: FinancialInstrument[];
  businessParticipations: BusinessParticipation[];
  cars: Car[];
  valuables: Valuable[];
  others: Other[];
}
