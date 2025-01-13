import { UserDTO } from '@backend/modules/users/dtos/UserDTO';

interface ParticipantState {
  id: number;
  title: string;
}

export interface ParticipantDTO {
  participantId: number;
  proceedingId: number;
  participantState: ParticipantState;
  user: UserDTO;
}
