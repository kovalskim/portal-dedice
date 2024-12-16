import { eq } from 'drizzle-orm';
import { MySql2Database } from 'drizzle-orm/mysql2';

import { participants, participantStates, users } from '@backend/db/schema';
import { AddParticipantDTO } from '@backend/dtos/AddParticipantDTO';
import { ParticipantDTO } from '@backend/dtos/ParticipantDTO';
import { PARTICIPANT_STATES } from '@backend/utils/constants';

export class ParticipantRepository {
  private db: MySql2Database<Record<string, unknown>>;

  constructor(db: MySql2Database<Record<string, unknown>>) {
    this.db = db;
  }

  async findProceedingParticipants(
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
          participantId: row.participants.id,
          proceedingId: row.participants.proceedingId,
          user: row.users,
          participantState: {
            id: row.participant_states.id,
            title: row.participant_states.title,
          },
        })),
      );
  }

  async deleteParticipant(participantId: number): Promise<void> {
    await this.db
      .delete(participants)
      .where(eq(participants.id, participantId));
  }

  async addParticipant(data: AddParticipantDTO): Promise<void> {
    await this.db.insert(participants).values({
      userId: data.userId,
      proceedingId: data.proceedingId,
      participantStateId:
        data.participantStateId ?? PARTICIPANT_STATES.WAITING_FOR_APPROVAL,
    });
  }

  async getParticipantById(participantId: number): Promise<ParticipantDTO> {
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
      .where(eq(participants.id, participantId));

    return result.map((row) => ({
      participantId: row.id,
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
    }))[0] as ParticipantDTO;
  }

  async updateParticipantStatus(
    participantId: number,
    stateId: number,
  ): Promise<void> {
    await this.db
      .update(participants)
      .set({ participantStateId: stateId })
      .where(eq(participants.id, participantId));
  }
}
