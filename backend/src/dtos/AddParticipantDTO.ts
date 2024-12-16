export interface AddParticipantDTO {
  userId: number;
  proceedingId: number;
  participantStateId?: number | null; // Optional state ID
}
