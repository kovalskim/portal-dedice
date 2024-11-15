import { endOfDay, startOfDay } from 'date-fns';
import { and, asc, desc, eq, gte, like, lte } from 'drizzle-orm';
import { MySql2Database } from 'drizzle-orm/mysql2';

import {
  participants,
  participantStates,
  phases,
  proceedings,
  users,
} from '@backend/db/schema';
import { UserRole } from '@backend/graphql/modules/user/roleType';

export interface ProceedingsDTO {
  id: number;
  phaseId: number;
  startDate: Date;
  notaryId: number;
  proceedingsNumber: string;
  deceasedFirstName: string;
  deceasedLastName: string;
  deceasedDateOfDeath: Date;
  deceasedDateOfBirth: Date;
  deceasedStreetWithNumber: string;
  deceasedCity: string;
  deceasedDistrict: string;
  deceasedPostalCode: string;
  phaseTitle?: string;
}

export interface CreateProceedingsDTO {
  proceedingsNumber: string;
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
}

interface ParticipantRow {
  participants: {
    proceedingId: number;
  };
  participant_states: {
    id: number;
    title: string;
  };
  users: {
    id: number;
    beforeTitle: string | null;
    firstname: string;
    lastname: string;
    afterTitle: string | null;
    email: string;
    isVerified: boolean;
  };
}

interface ParticipantDTO {
  proceedingId: number;
  participantState: {
    id: number;
    title: string;
  };
  user: {
    id: number;
    firstname: string;
    afterTitle: string | null;
    beforeTitle: string | null;
    isVerified: boolean;
    email: string;
    lastname: string;
  };
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
      .where(eq(phases.title, 'Úvodní fáze')); // TODO - pokud bude možnost v modálu při vytváření zvolit výchozí fázi, tak dodělat vyhledání přes id fáze

    if (!phase) {
      throw new Error('phase not found');
    }

    const newProceedingsId = await this.db
      .insert(proceedings)
      .values({
        phaseId: phase[0].id,
        ...proceedingsData,
      })
      .$returningId();

    return newProceedingsId[0].id;
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
  ): Promise<{ data: ProceedingsDTO[]; total: number }> {
    const offset = (currentPage - 1) * pageSize;

    let query = this.db
      .select({
        id: proceedings.id,
        phaseId: proceedings.phaseId,
        startDate: proceedings.startDate,
        notaryId: proceedings.notaryId,
        proceedingsNumber: proceedings.proceedingsNumber,
        deceasedFirstName: proceedings.deceasedFirstName,
        deceasedLastName: proceedings.deceasedLastName,
        deceasedDateOfDeath: proceedings.deceasedDateOfDeath,
        deceasedDateOfBirth: proceedings.deceasedDateOfBirth,
        deceasedStreetWithNumber: proceedings.deceasedStreetWithNumber,
        deceasedCity: proceedings.deceasedCity,
        deceasedDistrict: proceedings.deceasedDistrict,
        deceasedPostalCode: proceedings.deceasedPostalCode,
        phaseTitle: phases.title,
      })
      .from(proceedings)
      .innerJoin(phases, eq(proceedings.phaseId, phases.id));

    const whereConditions = [];

    if (identifier.type === UserRole.NOTARY) {
      whereConditions.push(eq(proceedings.notaryId, identifier.id));
    } else {
      query = query.innerJoin(
        participants,
        eq(proceedings.id, participants.proceedingId),
      );
      whereConditions.push(eq(participants.userId, identifier.id));
    }

    if (filterProceedingNumber) {
      whereConditions.push(
        like(proceedings.proceedingsNumber, `%${filterProceedingNumber}%`),
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
      query.orderBy(desc(proceedings.proceedingsNumber));
    } else {
      query.orderBy(asc(proceedings.proceedingsNumber));
    }

    const allProceedings = await query.execute();
    const limitProceedings = await query.limit(pageSize).offset(offset);

    return {
      data: limitProceedings as ProceedingsDTO[],
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
  ): Promise<{ data: ProceedingsDTO[]; total: number }> {
    // this is not react code, so the eslint rule does not make sense here
    // eslint-disable-next-line react/no-is-mounted
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
  ): Promise<{ data: ProceedingsDTO[]; total: number }> {
    // eslint-disable-next-line react/no-is-mounted
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
      .then((rows: ParticipantRow[]) =>
        rows.map((row) => ({
          proceedingId: row.participants.proceedingId,
          user: {
            id: row.users.id,
            beforeTitle: row.users.beforeTitle,
            firstname: row.users.firstname,
            lastname: row.users.lastname,
            afterTitle: row.users.afterTitle,
            email: row.users.email,
            isVerified: row.users.isVerified,
          },
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
      .from(proceedings)
      .where(
        and(eq(proceedings.notaryId, userId), eq(proceedings.id, proceedingId)),
      )
      .then((result) => result.length > 0);
  }
}
