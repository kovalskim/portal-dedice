import { and, eq } from 'drizzle-orm';
import { MySql2Database } from 'drizzle-orm/mysql2';

import {
  roles,
  users,
  VerificationReasonType,
  verificationTokens,
} from '@backend/db/schema';
import { UserRole } from '@backend/graphql/modules/user/roleType';
import { User } from '@backend/graphql/modules/user/userType';

export interface RoleDTO {
  id: number;
  name: UserRole;
}

export class UsersRepository {
  db: MySql2Database<Record<string, unknown>>;

  constructor(db: MySql2Database<Record<string, unknown>>) {
    this.db = db;
  }

  async findUsers(): Promise<User[]> {
    return this.db.select().from(users);
  }

  async getUserById(id: number) {
    const [user] = await this.db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string) {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email));
    return user;
  }

  async getRoleByName(name: string) {
    const [role] = await this.db
      .select()
      .from(roles)
      .where(eq(roles.name, name));
    return role;
  }

  async createUser(data: {
    email: string;
    password: string;
    firstname: string;
    lastname: string;
    roleId: number;
  }) {
    const resultingIds = await this.db
      .insert(users)
      .values({
        email: data.email,
        password: data.password,
        firstname: data.firstname,
        lastname: data.lastname,
        isVerified: false,
        roleId: data.roleId,
      })
      .$returningId();

    return resultingIds[0].id;
  }

  async createVerificationToken(data: {
    userId: number;
    token: string;
    expiresAt: Date;
    reason: VerificationReasonType;
  }) {
    const resultingIds = await this.db
      .insert(verificationTokens)
      .values({
        userId: data.userId,
        token: data.token,
        expiresAt: data.expiresAt.toISOString(),
        reason: data.reason,
      })
      .$returningId();

    return resultingIds[0].id;
  }

  async getVerificationTokenByUserIdAndReason(
    userId: number,
    reason: VerificationReasonType,
  ) {
    const [token] = await this.db
      .select()
      .from(verificationTokens)
      .where(
        and(
          eq(verificationTokens.userId, userId),
          eq(verificationTokens.reason, reason),
        ),
      );
    return token;
  }

  async getVerificationTokenByTokenAndReason(
    token: string,
    reason: VerificationReasonType,
  ) {
    const [tokenRecord] = await this.db
      .select()
      .from(verificationTokens)
      .where(
        and(
          eq(verificationTokens.token, token),
          eq(verificationTokens.reason, reason),
        ),
      );
    return tokenRecord;
  }

  async updateUser(user: User) {
    await this.db.update(users).set(user).where(eq(users.id, user.id));
  }

  async getUserRole(userId: number): Promise<RoleDTO | null> {
    return await this.db
      .select()
      .from(users)
      .leftJoin(roles, eq(users.roleId, roles.id))
      .where(eq(users.id, userId))
      .then(([user]) => {
        if (!user || !user.roles) {
          return null;
        }

        return {
          id: user.roles?.id,
          name: user.roles?.name as UserRole,
        };
      });
  }

  async updateUserPassword(userId: number, password: string) {
    await this.db
      .update(users)
      .set({ password: password })
      .where(eq(users.id, userId));
  }

  async deleteVerificationToken(tokenId: number) {
    await this.db
      .delete(verificationTokens)
      .where(eq(verificationTokens.id, tokenId));
  }
}
