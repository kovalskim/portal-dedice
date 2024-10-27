import { eq } from 'drizzle-orm';
import { MySql2Database } from 'drizzle-orm/mysql2';

import { phases, proceedings } from '@backend/db/schema';

export interface ProceedingsDTO {
  id: number;
  phaseId: number;
  startDate: Date;
  notaryId: number;
  proceedingsNumber: string;
  deceasedFirstName: string;
  deceasedLastName: string;
  deceasedDateOfDeath: Date;
}

export interface CreateProceedingsDTO {
  proceedingsNumber: string;
  deceasedFirstName: string;
  deceasedLastName: string;
  deceasedDateOfDeath: Date;
  notaryId: number;
}

export class ProceedingsRepository {
  db: MySql2Database<Record<string, unknown>>;

  constructor(db: MySql2Database<Record<string, unknown>>) {
    this.db = db;
  }

  async getProceedingsById(proceedingsId: number): Promise<ProceedingsDTO> {
    return await this.db
      .select()
      .from(proceedings)
      .where(eq(proceedings.id, proceedingsId))
      .then((proceedings) => proceedings[0] as ProceedingsDTO);
  }

  async createProceedings(
    proceedingsData: CreateProceedingsDTO,
  ): Promise<number> {
    const phase = await this.db
      .select()
      .from(phases)
      .where(eq(phases.title, 'phase1'));

    if (!phase) {
      throw new Error('phase not found');
    }

    const newProceedingsId = await this.db
      .insert(proceedings)
      .values({
        phaseId: phase[0].id,
        notaryId: proceedingsData.notaryId,
        startDate: new Date(),
        proceedingsNumber: proceedingsData.proceedingsNumber,
        deceasedFirstName: proceedingsData.deceasedFirstName,
        deceasedLastName: proceedingsData.deceasedLastName,
        deceasedDateOfDeath: proceedingsData.deceasedDateOfDeath,
      })
      .$returningId();

    return newProceedingsId[0].id;
  }
}
