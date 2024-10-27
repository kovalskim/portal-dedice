import { MySql2Database } from 'drizzle-orm/mysql2';

import { ProceedingsRepository } from '@backend/repository/ProceedingsRepository';
import { UserRepository } from '@backend/repository/UserRepository';

export type CustomContext = {
  db: MySql2Database<Record<string, unknown>>;
  authUser: JWTPayload | null;
  userRepository: UserRepository;
  proceedingsRepository: ProceedingsRepository;
};

export type JWTPayload = {
  id: number;
  iat: number;
  email?: string;
  userId: number;
};
