import { gql } from '@apollo/client';

export type CreateProceedingsResponse = {
  createProceedings: {
    id: string;
    proceedingsNumber: string;
  };
};

export const CREATE_PROCEEDING = gql`
  mutation CreateProceedings($data: DeceasedPersonInput!) {
    createProceedings(data: $data) {
      id
      proceedingsNumber
    }
  }
`;
