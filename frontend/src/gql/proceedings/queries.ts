import { gql } from '@apollo/client';

export const GET_ALL_PROCEEDINGS = gql`
  query GetAllProceedings {
    getAllProceedings {
      id
      proceedingsNumber
      deceasedFirstName
      deceasedLastName
      startDate
      phaseTitle
    }
  }
`;
