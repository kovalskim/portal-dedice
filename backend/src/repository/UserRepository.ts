import { eq } from 'drizzle-orm';
import { MySql2Database } from 'drizzle-orm/mysql2';

import { roles, users } from '@backend/db/schema';
import { UserRole } from '@backend/graphql/modules/user/roleType';

export interface RoleDTO {
  id: number;
  name: UserRole;
}

export class UserRepository {
  db: MySql2Database<Record<string, unknown>>;

  constructor(db: MySql2Database<Record<string, unknown>>) {
    this.db = db;
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
}
