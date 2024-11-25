import { gql } from '@apollo/client';

export const DELETE_FILE_MUTATION = gql`
  mutation DeleteFile($id: String!) {
    deleteFile(id: $id)
  }
`;

export const GET_SIGNED_URL_MUTATION = gql`
  mutation GetSignedUrl(
    $filetype: String!
    $filename: String!
    $proceedingId: String!
  ) {
    getSignedUrl(
      filetype: $filetype
      filename: $filename
      proceedingId: $proceedingId
    ) {
      url
    }
  }
`;

export const SAVE_FILE_MUTATION = gql`
  mutation saveFile(
    $type: String!
    $proceedingId: String!
    $alias: String!
    $key: String!
  ) {
    saveFile(type: $type, proceedingId: $proceedingId, alias: $alias, key: $key)
  }
`;
