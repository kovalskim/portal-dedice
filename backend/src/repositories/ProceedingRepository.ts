import { endOfDay, startOfDay } from 'date-fns';
import { and, asc, desc, eq, gte, inArray, like, lte } from 'drizzle-orm';
import { MySql2Database } from 'drizzle-orm/mysql2';

import { participants, phases, proceedings } from '@backend/db/schema';
import { CreateProceedingDTO } from '@backend/dtos/CreateProceedingDTO';
import { ProceedingDTO } from '@backend/dtos/ProceedingDTO';
import { PARTICIPANT_STATES } from '@backend/utils/constants';

export class ProceedingRepository {
  db: MySql2Database<Record<string, unknown>>;

  constructor(db: MySql2Database<Record<string, unknown>>) {
    this.db = db;
  }

  async getProceedingById(proceedingsId: number): Promise<ProceedingDTO> {
    return await this.db
      .select()
      .from(proceedings)
      .where(eq(proceedings.id, proceedingsId))
      .then((proceedings) => proceedings[0] as ProceedingDTO);
  }

  async createProceeding(proceedingData: CreateProceedingDTO): Promise<number> {
    const phase = await this.db
      .select()
      .from(phases)
      .where(eq(phases.title, 'Úvodní fáze')); // TODO - pokud bude možnost v modálu při vytváření zvolit výchozí fázi, tak dodělat vyhledání přes id fáze

    if (!phase) {
      throw new Error('phase not found');
    }

    const newProceedingId = await this.db
      .insert(proceedings)
      .values({
        phaseId: phase[0].id,
        ...proceedingData,
      })
      .$returningId();

    return newProceedingId[0].id;
  }

  private async fetchProceedings(
    identifier: { type: 'notary' | 'participant' | 'admin'; id?: number },
    currentPage: number = 1,
    pageSize: number = 0,
    sortOrder: 'asc' | 'desc' | 'default' = 'default',
    filterProceedingNumber?: string,
    filterDeceasedName?: string,
    filterStartDate?: string,
    filterPhaseId?: number,
    filterStatus?: string,
  ): Promise<{ data: ProceedingDTO[]; total: number }> {
    const offset = (currentPage - 1) * pageSize;

    let query = this.db
      .select({
        id: proceedings.id,
        phaseId: proceedings.phaseId,
        startDate: proceedings.startDate,
        notaryId: proceedings.notaryId,
        proceedingNumber: proceedings.proceedingNumber,
        deceasedFirstName: proceedings.deceasedFirstName,
        deceasedLastName: proceedings.deceasedLastName,
        deceasedDateOfDeath: proceedings.deceasedDateOfDeath,
        deceasedDateOfBirth: proceedings.deceasedDateOfBirth,
        deceasedStreetWithNumber: proceedings.deceasedStreetWithNumber,
        deceasedCity: proceedings.deceasedCity,
        deceasedDistrict: proceedings.deceasedDistrict,
        deceasedPostalCode: proceedings.deceasedPostalCode,
        deceasedSex: proceedings.deceasedSex,
        phaseTitle: phases.title,
      })
      .from(proceedings)
      .innerJoin(phases, eq(proceedings.phaseId, phases.id));

    const whereConditions = [];

    if (identifier.type === 'notary' && identifier.id) {
      whereConditions.push(eq(proceedings.notaryId, identifier.id));
    } else if (identifier.type === 'participant' && identifier.id) {
      query = query.innerJoin(
        participants,
        eq(proceedings.id, participants.proceedingId),
      );
      whereConditions.push(
        and(
          eq(participants.userId, identifier.id),
          inArray(participants.participantStateId, [
            PARTICIPANT_STATES.WAITING_FOR_APPROVAL,
            PARTICIPANT_STATES.APPROVED,
          ]),
        ),
      );
    }

    if (filterProceedingNumber) {
      whereConditions.push(
        like(proceedings.proceedingNumber, `%${filterProceedingNumber}%`),
      );
    }

    if (filterDeceasedName) {
      const [deceasedFirstName, deceasedLastName] =
        filterDeceasedName.split(' ');
      whereConditions.push(
        like(proceedings.deceasedFirstName, `%${deceasedFirstName ?? ''}%`),
        like(proceedings.deceasedLastName, `%${deceasedLastName ?? ''}%`),
      );
    }

    if (filterStartDate) {
      const normalizedStartDate = new Date(filterStartDate);
      whereConditions.push(
        gte(proceedings.startDate, startOfDay(normalizedStartDate)),
        lte(proceedings.startDate, endOfDay(normalizedStartDate)),
      );
    }

    if (filterPhaseId) {
      whereConditions.push(eq(proceedings.phaseId, filterPhaseId));
    }

    if (filterStatus && filterStatus === 'Ukončené') {
      whereConditions.push(eq(proceedings.phaseId, 4));
    } else if (filterStatus && filterStatus === 'Probíhající') {
      whereConditions.push(lte(proceedings.phaseId, 3));
    }

    query.where(and(...whereConditions));

    if (sortOrder === 'desc') {
      query.orderBy(desc(proceedings.proceedingNumber));
    } else if (sortOrder === 'asc') {
      query.orderBy(asc(proceedings.proceedingNumber));
    }

    const allProceedings = await query.execute();
    const limitProceedings = await query.limit(pageSize).offset(offset);

    return {
      data: limitProceedings as ProceedingDTO[],
      total: allProceedings.length,
    };
  }

  async getAllProceedingsByNotaryId(
    notaryId: number,
    currentPage: number = 1,
    pageSize: number = 0,
    sortOrder: 'asc' | 'desc' = 'desc',
    filterProceedingNumber?: string,
    filterDeceasedName?: string,
    filterStartDate?: string,
    filterPhaseId?: number,
    filterStatus?: string,
  ): Promise<{ data: ProceedingDTO[]; total: number }> {
    return this.fetchProceedings(
      { type: 'notary', id: notaryId },
      currentPage,
      pageSize,
      sortOrder,
      filterProceedingNumber,
      filterDeceasedName,
      filterStartDate,
      filterPhaseId,
      filterStatus,
    );
  }

  async getAllProceedingsByParticipantId(
    userId: number,
    currentPage: number = 1,
    pageSize: number = 0,
    sortOrder: 'asc' | 'desc' | 'default' = 'default',
    filterProceedingNumber?: string,
    filterDeceasedName?: string,
    filterStartDate?: string,
    filterPhaseId?: number,
    filterStatus?: string,
  ): Promise<{ data: ProceedingDTO[]; total: number }> {
    return this.fetchProceedings(
      { type: 'participant', id: userId },
      currentPage,
      pageSize,
      sortOrder,
      filterProceedingNumber,
      filterDeceasedName,
      filterStartDate,
      filterPhaseId,
      filterStatus,
    );
  }

  async getAllProceedings(
    currentPage: number = 1,
    pageSize: number = 0,
    sortOrder: 'asc' | 'desc' = 'desc',
    filterProceedingNumber?: string,
    filterDeceasedName?: string,
    filterStartDate?: string,
    filterPhaseId?: number,
    filterStatus?: string,
  ): Promise<{ data: ProceedingDTO[]; total: number }> {
    return this.fetchProceedings(
      { type: 'admin' },
      currentPage,
      pageSize,
      sortOrder,
      filterProceedingNumber,
      filterDeceasedName,
      filterStartDate,
      filterPhaseId,
      filterStatus,
    );
  }

  async updateProceeding(
    proceedingId: number,
    data: Partial<CreateProceedingDTO>,
  ): Promise<ProceedingDTO | null> {
    await this.db
      .update(proceedings)
      .set(data)
      .where(eq(proceedings.id, proceedingId));

    const updatedProceeding = await this.getProceedingById(proceedingId);

    if (!updatedProceeding) {
      throw new Error('Proceeding not found or update failed');
    }

    return updatedProceeding;
  }

  async deleteProceeding(proceedingId: number): Promise<void> {
    await this.db.delete(proceedings).where(eq(proceedings.id, proceedingId));

    const deletedProceeding = await this.getProceedingById(proceedingId);
    if (deletedProceeding) {
      throw new Error('Delete failed: proceeding still exists');
    }
  }

  async isUserParticipantInProceeding(userId: number, proceedingId: number) {
    return await this.db
      .select()
      .from(participants)
      .where(
        and(
          eq(participants.userId, userId),
          eq(participants.proceedingId, proceedingId),
          eq(participants.participantStateId, PARTICIPANT_STATES.APPROVED),
        ),
      )
      .then((result) => result.length > 0);
  }

  async isUserNotaryInProceeding(userId: number, proceedingId: number) {
    return await this.db
      .select()
      .from(proceedings)
      .where(
        and(eq(proceedings.notaryId, userId), eq(proceedings.id, proceedingId)),
      )
      .then((result) => result.length > 0);
  }
}
