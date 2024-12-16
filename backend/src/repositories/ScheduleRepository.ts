import { and, eq, sql } from 'drizzle-orm';
import { MySql2Database } from 'drizzle-orm/mysql2';

import { schedules } from '@backend/db/schema';
import { ScheduleDTO } from '@backend/dtos/ScheduleDTO';

export class ScheduleRepository {
  db: MySql2Database<Record<string, unknown>>;

  constructor(db: MySql2Database<Record<string, unknown>>) {
    this.db = db;
  }
  async getScheduleByCourtAndAttribute(
    courtId: number,
    attributeValue: string | undefined,
  ): Promise<ScheduleDTO> {
    return await this.db
      .select()
      .from(schedules)
      .where(
        and(
          eq(schedules.courtId, courtId),
          sql`${attributeValue}
          REGEXP
          ${schedules.pattern}`,
        ),
      )
      .then(([schedule]) => schedule as ScheduleDTO);
  }
}
