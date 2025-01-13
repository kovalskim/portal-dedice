export interface UserDTO {
  id: number;
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  isVerified: boolean;
  isBanned: boolean;
  roleId: number;
  beforeTitle: string | null;
  afterTitle: string | null;
  emailNotifications: boolean;
  criteriaId: number | null;
}
