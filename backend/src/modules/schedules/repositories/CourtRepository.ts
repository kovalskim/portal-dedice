import { eq } from 'drizzle-orm';
import { MySql2Database } from 'drizzle-orm/mysql2';

import { courts, districts } from '@backend/db/schema';
import { CourtDTO } from '@backend/modules/schedules/dtos/CourtDTO';

export class CourtRepository {
  db: MySql2Database<Record<string, unknown>>;

  constructor(db: MySql2Database<Record<string, unknown>>) {
    this.db = db;
  }

  async findCourts(): Promise<CourtDTO[]> {
    return await this.db.select().from(courts);
  }

  async getCourtById(id: number): Promise<CourtDTO> {
    return await this.db
      .select()
      .from(courts)
      .where(eq(courts.id, id))
      .then(([court]) => court);
  }

  async getCourtByDistrictName(districtName: string): Promise<CourtDTO> {
    return await this.db
      .select()
      .from(districts)
      .innerJoin(courts, eq(districts.courtId, courts.id))
      .where(eq(districts.name, districtName))
      .then(([result]) => result)
      .then(({ courts }) => courts);
  }
}
