import { MySql2Database } from 'drizzle-orm/mysql2';

export type CustomContext = {
  db: MySql2Database<Record<string, unknown>>;
  authUser: JWTPayload | null;
};

export type JWTPayload = {
  id: number;
  iat: number;
  email?: string;
  userId: number;
};
