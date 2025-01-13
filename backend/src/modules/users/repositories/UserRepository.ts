import { and, asc, desc, eq, like } from 'drizzle-orm';
import { MySql2Database } from 'drizzle-orm/mysql2';

import {
  roles,
  users,
  VerificationReasonType,
  verificationTokens,
} from '@backend/db/schema';
import { RoleDTO, UserRole } from '@backend/modules/users/dtos/RoleDTO';
import { UserDTO } from '@backend/modules/users/dtos/UserDTO';

export class UserRepository {
  db: MySql2Database<Record<string, unknown>>;

  constructor(db: MySql2Database<Record<string, unknown>>) {
    this.db = db;
  }

  async findUsers(
    currentPage: number = 1,
    pageSize: number = 0,
    sortByFirstnameOrder?: 'asc' | 'desc' | 'default',
    sortByLastnameOrder?: 'asc' | 'desc' | 'default',
    sortByEmailOrder?: 'asc' | 'desc' | 'default',
    filterFirstname?: string,
    filterLastname?: string,
    filterEmail?: string,
    filterRoleId?: number,
    filterIsVerified?: number,
    filterIsBanned?: number,
  ): Promise<{ data: UserDTO[]; total: number }> {
    const offset = (currentPage - 1) * pageSize;

    let query = this.db.select().from(users);

    const whereConditions = [];
    if (filterFirstname) {
      whereConditions.push(like(users.firstname, `%${filterFirstname}%`));
    }

    if (filterLastname) {
      whereConditions.push(like(users.lastname, `%${filterLastname}%`));
    }

    if (filterEmail) {
      whereConditions.push(like(users.email, `%${filterEmail}%`));
    }

    if (filterRoleId) {
      whereConditions.push(eq(users.roleId, filterRoleId));
    }

    if (filterIsVerified !== null) {
      whereConditions.push(eq(users.isVerified, Boolean(filterIsVerified)));
    }

    if (filterIsBanned !== null) {
      whereConditions.push(eq(users.isBanned, Boolean(filterIsBanned)));
    }

    query.where(and(...whereConditions));

    if (sortByFirstnameOrder === 'desc') {
      query.orderBy(desc(users.firstname));
    } else if (sortByFirstnameOrder === 'asc') {
      query.orderBy(asc(users.firstname));
    }

    if (sortByLastnameOrder === 'desc') {
      query.orderBy(desc(users.lastname));
    } else if (sortByLastnameOrder === 'asc') {
      query.orderBy(asc(users.lastname));
    }

    if (sortByEmailOrder === 'desc') {
      query.orderBy(desc(users.email));
    } else if (sortByEmailOrder === 'asc') {
      query.orderBy(asc(users.email));
    }

    const allUsers = await query.execute();
    const limitUsers = await query.limit(pageSize).offset(offset);

    return {
      data: limitUsers as UserDTO[],
      total: allUsers.length,
    };
  }

  async getUserById(id: number): Promise<UserDTO> {
    const [user] = await this.db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<UserDTO> {
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
    return {
      id: role.id,
      name: role.name,
      description: role.description,
    };
  }

  async createUser(data: {
    email: string;
    password: string;
    firstname: string;
    lastname: string;
    roleId: number;
    criteriaId: number | null;
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
        criteriaId: data.criteriaId,
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

  async updateUser(user: UserDTO) {
    await this.db.update(users).set(user).where(eq(users.id, user.id));
  }

  async getUserRole(userId: number): Promise<RoleDTO> {
    return await this.db
      .select()
      .from(users)
      .leftJoin(roles, eq(users.roleId, roles.id))
      .where(eq(users.id, userId))
      .then(([user]) => {
        return {
          id: user?.roles?.id as number,
          name: user?.roles?.name as UserRole,
          description: user?.roles?.description as string,
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
