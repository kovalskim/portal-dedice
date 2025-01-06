export interface UserInvitationDTO {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  role: string;
  token: string;
  expiresAt?: Date | null;
  criteriaId: number | null;
}
