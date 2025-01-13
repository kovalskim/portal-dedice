export interface CreateParticipantInvitationDTO {
  proceedingId: number;
  participantEmail: string;
  participantFirstname: string;
  participantLastname: string;
  token: string;
  expiresAt: Date;
}
