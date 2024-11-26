import { gql } from '@apollo/client';

export const NOTARY_PAYMENT_CALCULATION = gql`
  mutation notaryPaymentCalculation($estateTotalValue: Float!) {
    notaryPaymentCalculation(estateTotalValue: $estateTotalValue) {
      total
      fee
      vat
    }
  }
`;
