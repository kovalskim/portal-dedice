import { and, eq, like, sql } from 'drizzle-orm';
import { MySql2Database } from 'drizzle-orm/mysql2';

import { schedules } from '@backend/db/schema';
import { ScheduleDTO } from '@backend/modules/schedules/dtos/ScheduleDTO';

export class ScheduleRepository {
  db: MySql2Database<Record<string, unknown>>;

  constructor(db: MySql2Database<Record<string, unknown>>) {
    this.db = db;
  }

  async getScheduleByNotaryNameAndCourtId(name: string, courtId: number) {
    return await this.db
      .select()
      .from(schedules)
      .where(
        and(
          like(schedules.notaryName, `%${name}%`),
          eq(schedules.courtId, courtId),
        ),
      )
      .then(([schedule]) => schedule as ScheduleDTO);
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

  async updateSchedule(schedule: ScheduleDTO) {
    await this.db
      .update(schedules)
      .set(schedule)
      .where(eq(schedules.id, schedule.id));
  }
}
