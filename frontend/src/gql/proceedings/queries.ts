import { gql } from '@apollo/client';

export const GET_ALL_PROCEEDINGS = gql`
  query GetAllProceedings(
    $pageSize: Float!
    $currentPage: Float!
    $sortOrder: String!
    $filterProceedingNumber: String!
    $filterDeceasedName: String!
    $filterStartDate: String!
    $filterPhaseId: Float!
    $filterStatus: String!
  ) {
    getAllProceedings(
      pageSize: $pageSize
      currentPage: $currentPage
      sortOrder: $sortOrder
      filterProceedingNumber: $filterProceedingNumber
      filterDeceasedName: $filterDeceasedName
      filterStartDate: $filterStartDate
      filterPhaseId: $filterPhaseId
      filterStatus: $filterStatus
    ) {
      data {
        id
        proceedingsNumber
        deceasedFirstName
        deceasedLastName
        startDate
        phaseTitle
      }
      total
    }
  }
`;

export type Proceeding = {
  id: number;
  proceedingsNumber: string;
  deceasedFirstName: string;
  deceasedLastName: string;
  deceasedDateOfDeath?: string;
  phaseId?: number;
  phaseTitle?: string;
  startDate: string;
  notary?: {
    id: number;
    beforeTitle: string;
    firstname: string;
    lastname: string;
    afterTitle: string;
  };
};

export type ProceedingsResponse = {
  getAllProceedings: {
    data: Proceeding[];
    total: number;
  };
};

export type ProceedingResponse = {
  getProceeding: Proceeding;
};

export const GET_PROCEEDING_BY_ID = gql`
  query GetProceeding($id: Float!) {
    getProceeding(id: $id) {
      id
      notary {
        id
        beforeTitle
        firstname
        lastname
        afterTitle
      }
      proceedingsNumber
      deceasedFirstName
      deceasedLastName
      deceasedDateOfDeath
      phaseId
      startDate
    }
  }
`;

export type Participant = {
  proceedingId: number;
  user: {
    id: number;
    email: string;
    beforeTitle: string;
    firstname: string;
    lastname: string;
    afterTitle: string;
  };
  participantState: {
    id: number;
    title: string;
  };
};

export type ParticipantsResponse = {
  proceedingParticipants: Participant[];
};

export const GET_PROCEEDING_PARTICIPANTS = gql`
  query ProceedingParticipants($proceedingId: Float!) {
    proceedingParticipants(id: $proceedingId) {
      proceedingId
      user {
        id
        beforeTitle
        firstname
        lastname
        afterTitle
        email
      }
      participantState {
        id
        title
      }
    }
  }
`;
