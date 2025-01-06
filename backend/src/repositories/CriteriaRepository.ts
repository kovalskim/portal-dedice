import { eq } from 'drizzle-orm';
import { MySql2Database } from 'drizzle-orm/mysql2';

import {
  daysMonthsCriteria,
  lettersCriteria,
  notaryCriteria,
} from '@backend/db/schema';
import { CriteriaInputDTO } from '@backend/dtos/CriteriaInputDTO';

export class CriteriaRepository {
  db: MySql2Database<Record<string, unknown>>;

  constructor(db: MySql2Database<Record<string, unknown>>) {
    this.db = db;
  }

  async getNotaryCriteriaRulesById(criteriaId: number) {
    return (await this.db
      .select()
      .from(notaryCriteria)
      .where(eq(notaryCriteria.id, criteriaId))
      .then(([criteria]) => criteria)) as {
      id: number;
      courtId: number;
      lastnameLettersActive: boolean;
      birthDaysMonthsActive: boolean;
      deathDaysMonthsActive: boolean;
    };
  }

  async getLastnameLettersCriteria(criteriaId: number) {
    return (await this.db
      .select({ letter: lettersCriteria.letter })
      .from(lettersCriteria)
      .where(eq(lettersCriteria.criteriaId, criteriaId))) as {
      letter: string;
    }[];
  }

  async getDayMonthCriteria(criteriaId: number) {
    return (await this.db
      .select({
        type: daysMonthsCriteria.type,
        day: daysMonthsCriteria.day,
        month: daysMonthsCriteria.month,
      })
      .from(daysMonthsCriteria)
      .where(eq(daysMonthsCriteria.criteriaId, criteriaId))) as {
      type: string;
      day: number;
      month: number;
    }[];
  }

  async insertNotaryCriteria(criteria: CriteriaInputDTO): Promise<number> {
    const result = await this.db
      .insert(notaryCriteria)
      .values({
        courtId: Number(criteria.court.value),
        lastnameLettersActive: criteria.rules.lastnameLetters,
        birthDaysMonthsActive: criteria.rules.birthDaysMonths,
        deathDaysMonthsActive: criteria.rules.deathDaysMonths,
      })
      .$returningId();
    return result[0].id;
  }

  async insertLastnameLettersCriteria(
    criteriaId: number,
    letters: { value: string }[],
  ): Promise<void> {
    const letterValues = letters.map((letter) => ({
      criteriaId,
      letter: letter.value,
    }));
    if (letterValues.length > 0) {
      await this.db.insert(lettersCriteria).values(letterValues);
    }
  }

  async insertDaysMonthsCriteria(
    criteriaId: number,
    criteria: CriteriaInputDTO,
  ) {
    const birthDaysMonths = this.prepareDaysMonths(
      criteria.birthDaysMonths,
      'birth',
      criteriaId,
    );
    const deathDaysMonths = this.prepareDaysMonths(
      criteria.deathDaysMonths,
      'death',
      criteriaId,
    );

    const daysMonths = [...birthDaysMonths, ...deathDaysMonths];
    if (daysMonths.length > 0) {
      await this.db.insert(daysMonthsCriteria).values(daysMonths);
    }
  }

  private prepareDaysMonths(
    groups: { days: { value: number }[]; months: { value: number }[] }[],
    type: string,
    criteriaId: number,
  ): {
    day: number | null;
    month: number | null;
    type: string;
    criteriaId: number;
  }[] {
    const daysMonths: {
      day: number | null;
      month: number | null;
      type: string;
      criteriaId: number;
    }[] = [];

    for (const group of groups) {
      const days = group.days.map((day) => day.value);
      const months = group.months.map((month) => month.value);

      if (days.length > 0 && months.length > 0) {
        for (const day of days) {
          for (const month of months) {
            daysMonths.push({ day, month, type, criteriaId });
          }
        }
      } else {
        for (const day of days) {
          daysMonths.push({ day, month: null, type, criteriaId });
        }
        for (const month of months) {
          daysMonths.push({ day: null, month, type, criteriaId });
        }
      }
    }

    return daysMonths;
  }
}
