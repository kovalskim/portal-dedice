export interface ParticipantInvitationDTO {
  id: number;
  proceedingId: number;
  participantEmail: string;
  participantFirstname: string;
  participantLastname: string;
  token: string;
  expiresAt: Date;
}
