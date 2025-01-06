import { gql } from '@apollo/client';

export type Court = {
  id: number;
  name: string;
};

export type CourtsResponse = {
  courts: Court[];
};

export const GET_COURTS = gql`
  query AllCourts {
    courts {
      id
      name
    }
  }
`;

export type NotaryCriteriaResponse = {
  notaryCriteria: {
    court: {
      id: number;
      name: string;
    };
    lastnameLetters: string[];
    birthDaysMonths: { days: number[]; months: number[] }[];
    deathDaysMonths: { days: number[]; months: number[] }[];
    rules: {
      lastnameLetters: boolean;
      birthDaysMonths: boolean;
      deathDaysMonths: boolean;
    };
  };
};

export const NOTARY_CRITERIA = gql`
  query NotaryCriteria($userId: Float!) {
    notaryCriteria(userId: $userId) {
      court {
        name
      }
      lastnameLetters
      birthDaysMonths {
        days
        months
      }
      deathDaysMonths {
        days
        months
      }
      rules {
        lastnameLetters
        birthDaysMonths
        deathDaysMonths
      }
    }
  }
`;
