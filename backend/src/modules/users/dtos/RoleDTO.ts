export interface RoleDTO {
  id: number;
  name: UserRole;
  description: string;
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  NOTARY = 'notary',
}
