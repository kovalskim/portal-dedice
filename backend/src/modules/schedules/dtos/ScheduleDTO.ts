export interface ScheduleDTO {
  id: number;
  notaryId?: number;
  notaryName: string;
  secondaryNotaryId?: number;
  secondaryNotaryName: string;
  courtId: number;
  pattern: string;
}
