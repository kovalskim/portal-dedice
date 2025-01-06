import { eq } from 'drizzle-orm';
import { MySql2Database } from 'drizzle-orm/mysql2';

import { userInvitations } from '@backend/db/schema';
import { CreateUserInvitationDTO } from '@backend/dtos/CreateUserInvitationDTO';
import { UserInvitationDTO } from '@backend/dtos/UserInvitationDTO';
import { AppError } from '@backend/errors/AppError';

export class UserInvitationRepository {
  db: MySql2Database<Record<string, unknown>>;

  constructor(db: MySql2Database<Record<string, unknown>>) {
    this.db = db;
  }

  async getInvitationByToken(token: string): Promise<UserInvitationDTO> {
    const [tokenRecord] = await this.db
      .select()
      .from(userInvitations)
      .where(eq(userInvitations.token, token));
    return tokenRecord;
  }

  async deleteInvitationToken(invitationId: number) {
    await this.db
      .delete(userInvitations)
      .where(eq(userInvitations.id, invitationId));
  }

  async createUserInvitation(
    invitationData: CreateUserInvitationDTO,
  ): Promise<number> {
    const newInvitationId = await this.db
      .insert(userInvitations)
      .values(invitationData)
      .$returningId();

    if (!newInvitationId[0].id) {
      throw new AppError(
        'SERVER_ERROR',
        'Failed to create participant invitation',
      );
    }

    return newInvitationId[0].id;
  }
}
