import { gql } from '@apollo/client';

export type CreateProceedingResponse = {
  createProceeding: {
    id: string;
    proceedingNumber: string;
  };
};

export type UpdateProceedingResponse = {
  updateProceeding: {
    id: string;
    proceedingNumber: string;
  };
};

export type DeleteProceedingResponse = {
  deleteProceeding: boolean;
};

export const DELETE_PROCEEDING = gql`
  mutation Mutation($id: Float!) {
    deleteProceeding(id: $id)
  }
`;

export const CREATE_PROCEEDING = gql`
  mutation CreateProceeding($data: NewProceedingInput!) {
    createProceeding(data: $data) {
      id
      proceedingNumber
    }
  }
`;

export const UPDATE_PROCEEDING = gql`
  mutation Mutation($data: DeceasedPersonInput!, $id: Float!) {
    updateProceeding(data: $data, id: $id) {
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

export const INVITE_PARTICIPANTS_TO_PROCEEDING = gql`
  mutation InviteParticipantToProceeding($data: ParticipantsInput!) {
    inviteParticipantToProceeding(data: $data)
  }
`;

export const APPROVE_PARTICIPANT = gql`
  mutation ApproveParticipant($data: UpdateParticipantStateInput!) {
    approveParticipant(data: $data) {
      participantId
    }
  }
`;

export const REJECT_PARTICIPANT = gql`
  mutation RejectParticipant($data: UpdateParticipantStateInput!) {
    rejectParticipant(data: $data) {
      participantId
    }
  }
`;

export const DELETE_PARTICIPANT = gql`
  mutation DeleteParticipantById($data: DeleteParticipantInput!) {
    deleteParticipantById(data: $data)
  }
`;
