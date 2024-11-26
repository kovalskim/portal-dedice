import { endOfDay, startOfDay } from 'date-fns';
import { and, asc, desc, eq, gte, like, lte } from 'drizzle-orm';
import { MySql2Database } from 'drizzle-orm/mysql2';

import {
  participants,
  participantStates,
  phases,
  proceedings as proceeding,
  users,
} from '@backend/db/schema';
import { UserRole } from '@backend/graphql/modules/user/roleType';

import { UserDTO } from './UsersRepository';

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

export interface CreateProceedingDTO {
  proceedingNumber: string;
  deceasedFirstName: string;
  deceasedLastName: string;
  deceasedDateOfDeath: Date;
  deceasedDateOfBirth: Date;
  deceasedStreetWithNumber: string;
  deceasedCity: string;
  deceasedDistrict: string;
  deceasedPostalCode: string;
  notaryId: number;
  startDate: Date;
  deceasedSex?: string;
  narratorFirstname?: string;
  narratorLastname?: string;
  narratorEmail?: string;
}

interface ParticipantDTO {
  proceedingId: number;
  participantState: {
    id: number;
    title: string;
  };
  user: UserDTO;
}

export class ProceedingsRepository {
  db: MySql2Database<Record<string, unknown>>;

  constructor(db: MySql2Database<Record<string, unknown>>) {
    this.db = db;
  }

  async getProceedingById(proceedingsId: number): Promise<ProceedingDTO> {
    return await this.db
      .select()
      .from(proceeding)
      .where(eq(proceeding.id, proceedingsId))
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
      .insert(proceeding)
      .values({
        phaseId: phase[0].id,
        ...proceedingData,
      })
      .$returningId();

    return newProceedingId[0].id;
  }

  private async fetchProceedings(
    identifier: { type: 'notary' | 'participant'; id: number },
    currentPage: number = 1,
    pageSize: number = 0,
    sortOrder: 'asc' | 'desc' = 'desc',
    filterProceedingNumber?: string,
    filterDeceasedName?: string,
    filterStartDate?: string,
    filterPhaseId?: number,
    filterStatus?: string,
  ): Promise<{ data: ProceedingDTO[]; total: number }> {
    const offset = (currentPage - 1) * pageSize;

    let query = this.db
      .select({
        id: proceeding.id,
        phaseId: proceeding.phaseId,
        startDate: proceeding.startDate,
        notaryId: proceeding.notaryId,
        proceedingNumber: proceeding.proceedingNumber,
        deceasedFirstName: proceeding.deceasedFirstName,
        deceasedLastName: proceeding.deceasedLastName,
        deceasedDateOfDeath: proceeding.deceasedDateOfDeath,
        deceasedDateOfBirth: proceeding.deceasedDateOfBirth,
        deceasedStreetWithNumber: proceeding.deceasedStreetWithNumber,
        deceasedCity: proceeding.deceasedCity,
        deceasedDistrict: proceeding.deceasedDistrict,
        deceasedPostalCode: proceeding.deceasedPostalCode,
        deceasedSex: proceeding.deceasedSex,
        phaseTitle: phases.title,
      })
      .from(proceeding)
      .innerJoin(phases, eq(proceeding.phaseId, phases.id));

    const whereConditions = [];

    if (identifier.type === UserRole.NOTARY) {
      whereConditions.push(eq(proceeding.notaryId, identifier.id));
    } else {
      query = query.innerJoin(
        participants,
        eq(proceeding.id, participants.proceedingId),
      );
      whereConditions.push(eq(participants.userId, identifier.id));
    }

    if (filterProceedingNumber) {
      whereConditions.push(
        like(proceeding.proceedingNumber, `%${filterProceedingNumber}%`),
      );
    }

    if (filterDeceasedName) {
      const [deceasedFirstName, deceasedLastName] =
        filterDeceasedName.split(' ');
      whereConditions.push(
        like(proceeding.deceasedFirstName, `%${deceasedFirstName ?? ''}%`),
        like(proceeding.deceasedLastName, `%${deceasedLastName ?? ''}%`),
      );
    }

    if (filterStartDate) {
      const normalizedStartDate = new Date(filterStartDate);
      whereConditions.push(
        gte(proceeding.startDate, startOfDay(normalizedStartDate)),
        lte(proceeding.startDate, endOfDay(normalizedStartDate)),
      );
    }

    if (filterPhaseId) {
      whereConditions.push(eq(proceeding.phaseId, filterPhaseId));
    }

    if (filterStatus && filterStatus === 'Ukončené') {
      whereConditions.push(eq(proceeding.phaseId, 4));
    } else if (filterStatus && filterStatus === 'Probíhající') {
      whereConditions.push(lte(proceeding.phaseId, 3));
    }

    query.where(and(...whereConditions));

    if (sortOrder === 'desc') {
      query.orderBy(desc(proceeding.proceedingNumber));
    } else {
      query.orderBy(asc(proceeding.proceedingNumber));
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
    sortOrder: 'asc' | 'desc' = 'desc',
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

  async updateProceeding(
    proceedingId: number,
    data: Partial<CreateProceedingDTO>,
  ): Promise<ProceedingDTO | null> {
    await this.db
      .update(proceeding)
      .set(data)
      .where(eq(proceeding.id, proceedingId));

    const updatedProceeding = await this.getProceedingById(proceedingId);

    if (!updatedProceeding) {
      throw new Error('Proceeding not found or update failed');
    }

    return updatedProceeding;
  }

  async deleteProceeding(proceedingId: number): Promise<void> {
    await this.db.delete(proceeding).where(eq(proceeding.id, proceedingId));

    const deletedProceeding = await this.getProceedingById(proceedingId);
    if (deletedProceeding) {
      throw new Error('Delete failed: proceeding still exists');
    }
  }

  async getProceedingParticipants(
    proceedingId: number,
  ): Promise<ParticipantDTO[]> {
    return await this.db
      .select()
      .from(participants)
      .innerJoin(users, eq(users.id, participants.userId))
      .innerJoin(
        participantStates,
        eq(participantStates.id, participants.participantStateId),
      )
      .where(eq(participants.proceedingId, proceedingId))
      .then((rows) =>
        rows.map((row) => ({
          proceedingId: row.participants.proceedingId,
          user: row.users,
          participantState: {
            id: row.participant_states.id,
            title: row.participant_states.title,
          },
        })),
      );
  }

  async isUserParticipantInProceeding(userId: number, proceedingId: number) {
    return await this.db
      .select()
      .from(participants)
      .where(
        and(
          eq(participants.userId, userId),
          eq(participants.proceedingId, proceedingId),
        ),
      )
      .then((result) => result.length > 0);
  }

  async isUserNotaryInProceeding(userId: number, proceedingId: number) {
    return await this.db
      .select()
      .from(proceeding)
      .where(
        and(eq(proceeding.notaryId, userId), eq(proceeding.id, proceedingId)),
      )
      .then((result) => result.length > 0);
  }
}
