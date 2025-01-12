import { gql } from '@apollo/client';

import { User } from '@frontend/gql/user/types.ts';

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

export type UsersResponse = {
  users: {
    data: User[];
    total: number;
  };
};

export const GET_ALL_USERS = gql`
  query users(
    $pageSize: Float!
    $currentPage: Float!
    $sortByFirstnameOrder: String!
    $sortByLastnameOrder: String!
    $sortByEmailOrder: String!
    $filterFirstname: String!
    $filterLastname: String!
    $filterEmail: String!
    $filterRoleId: Float!
    $filterIsVerified: Float
    $filterIsBanned: Float
  ) {
    users(
      pageSize: $pageSize
      currentPage: $currentPage
      sortByFirstnameOrder: $sortByFirstnameOrder
      sortByLastnameOrder: $sortByLastnameOrder
      sortByEmailOrder: $sortByEmailOrder
      filterFirstname: $filterFirstname
      filterLastname: $filterLastname
      filterEmail: $filterEmail
      filterRoleId: $filterRoleId
      filterIsVerified: $filterIsVerified
      filterIsBanned: $filterIsBanned
    ) {
      data {
        id
        firstname
        lastname
        email
        isVerified
        isBanned
        role {
          description
        }
      }
      total
    }
  }
`;
