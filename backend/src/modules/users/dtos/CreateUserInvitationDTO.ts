export interface CreateUserInvitationDTO {
  email: string;
  firstname: string;
  lastname: string;
  role: string;
  criteriaId: number | null;
  token: string;
  expiresAt?: Date | null;
}
