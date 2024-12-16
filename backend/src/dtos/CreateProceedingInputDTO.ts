import { DeceasedPersonInputDTO } from '@backend/dtos/DeceasedPersonInputDTO';

export interface CreateProceedingInputDTO {
  deceasedPersonInfo: DeceasedPersonInputDTO;
  narratorContactInfo: {
    firstname: string;
    lastname: string;
    email: string;
  };
}
