export interface ProceedingDTO {
  id: number;
  phaseId: number;
  startDate: Date;
  notaryId: number;
  proceedingNumber: string;
  deceasedFirstName: string;
  deceasedLastName: string;
  deceasedDateOfDeath: Date;
  deceasedDateOfBirth: Date;
  deceasedStreetWithNumber: string;
  deceasedCity: string;
  deceasedDistrict: string;
  deceasedPostalCode: string;
  deceasedSex?: string;
  phaseTitle?: string;
}
