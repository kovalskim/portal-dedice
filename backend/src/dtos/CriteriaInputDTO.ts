export interface CriteriaInputDTO {
  court: { label: string; value: string };
  lastnameLetters: { label: string; value: string }[];
  birthDaysMonths: {
    days: { label: number; value: number }[];
    months: { label: number; value: number }[];
  }[];
  deathDaysMonths: {
    days: { label: number; value: number }[];
    months: { label: number; value: number }[];
  }[];
  rules: {
    lastnameLetters: boolean;
    birthDaysMonths: boolean;
    deathDaysMonths: boolean;
  };
}
