export interface CreateProceedingDTO {
  phaseId?: number;
  proceedingNumber: string;
  deceasedFirstName: string;
  deceasedLastName: string;
  deceasedDateOfDeath: Date;
  deceasedDateOfBirth: Date;
  deceasedStreetWithNumber: string;
  deceasedCity: string;
  deceasedDistrict: string;
  deceasedPostalCode: string;
  notaryId: number;
  startDate: Date;
  deceasedSex?: string;
}
