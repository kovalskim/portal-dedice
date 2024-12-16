export interface RoleDTO {
  id: number;
  name: UserRole;
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  NOTARY = 'notary',
}
