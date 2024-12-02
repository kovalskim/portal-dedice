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
        proceedingNumber
        deceasedFirstName
        deceasedLastName
        deceasedDateOfBirth
        deceasedDateOfDeath
        deceasedStreetWithNumber
        deceasedCity
        deceasedDistrict
        deceasedPostalCode
        deceasedSex
        startDate
        phaseTitle
        isLoggedUserApprovedParticipantOrNotary
      }
      total
    }
  }
`;

export type Proceeding = {
  id: number;
  proceedingNumber: string;
  deceasedFirstName: string;
  deceasedLastName: string;
  deceasedDateOfDeath?: string;
  phaseId?: number;
  phaseTitle?: string;
  startDate: string;
  deceasedDateOfBirth: string;
  deceasedStreetWithNumber: string;
  deceasedCity: string;
  deceasedDistrict: string;
  deceasedPostalCode: string;
  deceasedSex: string;
  notary?: {
    id: number;
    beforeTitle: string;
    firstname: string;
    lastname: string;
    afterTitle: string;
  };
  isLoggedUserApprovedParticipantOrNotary: boolean;
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
      proceedingNumber
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
  participantId: number;
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
      participantId
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
