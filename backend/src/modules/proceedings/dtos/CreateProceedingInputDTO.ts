import { DeceasedPersonInputDTO } from '@backend/modules/schedules/dtos/DeceasedPersonInputDTO';

export interface CreateProceedingInputDTO {
  deceasedPersonInfo: DeceasedPersonInputDTO;
  narratorContactInfo: {
    firstname: string;
    lastname: string;
    email: string;
  };
}
