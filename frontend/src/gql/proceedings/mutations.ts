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

export const SEND_MESSAGE_TO_PARTICIPANS = gql`
  mutation sendMessageToParticipans($data: SendEmailRequest!) {
    sendMessageToParticipans(data: $data)
  }
`;
