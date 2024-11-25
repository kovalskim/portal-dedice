import { User } from '@frontend/gql/user/types.ts';

export type FileUser = Pick<
  User,
  'id' | 'beforeTitle' | 'firstname' | 'lastname' | 'afterTitle'
>;

export interface File {
  id: number;
  alias: string;
  path: string;
  timestamp: string;
  type: 'pdf' | 'docx';
  user: FileUser;
}
