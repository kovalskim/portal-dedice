import { eq } from 'drizzle-orm';
import { MySql2Database } from 'drizzle-orm/mysql2';

import { participantInvitations } from '@backend/db/schema';
import { CreateParticipantInvitationDTO } from '@backend/modules/participants/dtos/CreateParticipantInvitationDTO';
import { ParticipantInvitationDTO } from '@backend/modules/participants/dtos/ParticipantInvitationDTO';

export class ParticipantInvitationRepository {
  db: MySql2Database<Record<string, unknown>>;

  constructor(db: MySql2Database<Record<string, unknown>>) {
    this.db = db;
  }

  async createParticipantInvitation(
    invitationData: CreateParticipantInvitationDTO,
  ): Promise<number> {
    const newInvitationId = await this.db
      .insert(participantInvitations)
      .values(invitationData)
      .$returningId();

    if (!newInvitationId[0].id) {
      throw new Error('Failed to create participant invitation');
    }

    return newInvitationId[0].id;
  }

  async getParticipantInvitationById(
    invitationId: number,
  ): Promise<ParticipantInvitationDTO | null> {
    const invitation = await this.db
      .select()
      .from(participantInvitations)
      .where(eq(participantInvitations.id, invitationId))
      .then(
        (invitations) => invitations[0] as ParticipantInvitationDTO | undefined,
      );

    return invitation || null;
  }

  async findInvitationsByProceedingId(
    proceedingId: number,
  ): Promise<ParticipantInvitationDTO[]> {
    return await this.db
      .select()
      .from(participantInvitations)
      .where(eq(participantInvitations.proceedingId, proceedingId));
  }

  async deleteParticipantInvitation(invitationId: number): Promise<void> {
    await this.db
      .delete(participantInvitations)
      .where(eq(participantInvitations.id, invitationId));

    const deletedInvitation =
      await this.getParticipantInvitationById(invitationId);
    if (deletedInvitation) {
      throw new Error('Delete failed: invitation still exists');
    }
  }

  async getParticipantInvitationByToken(
    token: string,
  ): Promise<ParticipantInvitationDTO | null> {
    return await this.db
      .select()
      .from(participantInvitations)
      .where(eq(participantInvitations.token, token))
      .then((rows) => rows[0] || null);
  }
}
