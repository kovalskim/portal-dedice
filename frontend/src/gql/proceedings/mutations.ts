import { gql } from '@apollo/client';

export type CreateProceedingsResponse = {
  createProceedings: {
    id: string;
    proceedingNumber: string;
  };
};

export type UpdateProceedingsResponse = {
  updateProceedings: {
    id: string;
    proceedingNumber: string;
  };
};

export type DeleteProceedingsResponse = {
  deleteProceedings: boolean;
};

export const DELETE_PROCEEDING = gql`
  mutation Mutation($id: Float!) {
    deleteProceedings(id: $id)
  }
`;

export const CREATE_PROCEEDING = gql`
  mutation CreateProceedings($data: NewProceedingInput!) {
    createProceedings(data: $data) {
      id
      proceedingNumber
    }
  }
`;

export const UPDATE_PROCEEDING = gql`
  mutation Mutation($data: DeceasedPersonInput!, $id: Float!) {
    updateProceedings(data: $data, id: $id) {
      id
      proceedingNumber
    }
  }
`;

export const ACCEPT_INVITATION_MUTATION = gql`
  mutation AcceptParticipantInvitation($token: String!) {
    acceptParticipantInvitation(token: $token)
  }
`;

export const SEND_MESSAGE_TO_PARTICIPANTS = gql`
  mutation sendMessageToParticipants($data: SendEmailRequest!) {
    sendMessageToParticipants(data: $data)
  }
`;
