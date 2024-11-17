import { and, eq } from 'drizzle-orm';
import { MySql2Database } from 'drizzle-orm/mysql2';

import { participants, participantStates, users } from '@backend/db/schema';
import { participant_states } from '@backend/utils/constants';

export interface CreateParticipantDTO {
  userId: number;
  proceedingId: number;
  participantStateId?: number;
}

export interface ParticipantDTO {
  id: number;
  user: {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    beforeTitle?: string | null;
    afterTitle?: string | null;
    isVerified: boolean;
  };
  proceedingId: number;
  participantState?: {
    id: number;
    title: string;
  };
}

export interface AddParticipantDTO {
  userId: number;
  proceedingId: number;
  participantStateId?: number | null; // Optional state ID
}

export class ParticipantsRepository {
  private db: MySql2Database<Record<string, unknown>>;

  constructor(db: MySql2Database<Record<string, unknown>>) {
    this.db = db;
  }

  async getParticipantsByProceedingId(
    proceedingId: number,
  ): Promise<ParticipantDTO[]> {
    const result = await this.db
      .select({
        id: participants.id,
        proceedingId: participants.proceedingId,
        userId: users.id,
        firstname: users.firstname,
        lastname: users.lastname,
        email: users.email,
        beforeTitle: users.beforeTitle,
        afterTitle: users.afterTitle,
        isVerified: users.isVerified,
        stateId: participantStates.id,
        stateTitle: participantStates.title,
      })
      .from(participants)
      .innerJoin(users, eq(users.id, participants.userId))
      .leftJoin(
        participantStates,
        eq(participantStates.id, participants.participantStateId),
      )
      .where(eq(participants.proceedingId, proceedingId));

    return result.map((row) => ({
      id: row.id,
      proceedingId: row.proceedingId,
      user: {
        id: row.userId,
        firstname: row.firstname,
        lastname: row.lastname,
        email: row.email,
        beforeTitle: row.beforeTitle,
        afterTitle: row.afterTitle,
        isVerified: row.isVerified,
      },
      participantState: row.stateId
        ? {
            id: row.stateId,
            title: row.stateTitle || '',
          }
        : undefined,
    }));
  }

  async deleteParticipant(participantId: number): Promise<void> {
    await this.db
      .delete(participants)
      .where(eq(participants.id, participantId));
  }

  async isUserParticipantInProceeding(
    userId: number,
    proceedingId: number,
  ): Promise<boolean> {
    const participant = await this.db
      .select()
      .from(participants)
      .where(
        and(
          eq(participants.userId, userId),
          eq(participants.proceedingId, proceedingId),
        ),
      );

    return participant.length > 0; // Return true if a matching participant is found
  }

  async addParticipant(data: AddParticipantDTO): Promise<void> {
    await this.db.insert(participants).values({
      userId: data.userId,
      proceedingId: data.proceedingId,
      participantStateId:
        data.participantStateId ?? participant_states.WAITING_FOR_APPROVAL,
    });
  }
}
