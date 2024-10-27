import { gql } from '@apollo/client';

export type CreateProceedingsResponse = {
  createProceedings: {
    id: string;
    proceedingsNumber: string;
  };
};

export const CREATE_PROCEEDING = gql`
  mutation CreateProceedings(
    $deceasedDateOfDeath: String!
    $deceasedLastName: String!
    $deceasedFirstName: String!
    $proceedingsNumber: String!
  ) {
    createProceedings(
      deceasedDateOfDeath: $deceasedDateOfDeath
      deceasedLastName: $deceasedLastName
      deceasedFirstName: $deceasedFirstName
      proceedingsNumber: $proceedingsNumber
    ) {
      id
      proceedingsNumber
    }
  }
`;
