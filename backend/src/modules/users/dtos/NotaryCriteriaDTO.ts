export interface NotaryCriteriaDTO {
  court: {
    id: number;
    name: string;
  };
  lastnameLetters: string[];
  birthDaysMonths: {
    days: number[];
    months: number[];
  }[];
  deathDaysMonths: {
    days: number[];
    months: number[];
  }[];
  rules: {
    lastnameLetters: boolean;
    birthDaysMonths: boolean;
    deathDaysMonths: boolean;
  };
}
