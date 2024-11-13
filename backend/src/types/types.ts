import { MySql2Database } from 'drizzle-orm/mysql2';

import { MessagesRepository } from '@backend/repository/MessagesRepository';
import { ProceedingsRepository } from '@backend/repository/ProceedingsRepository';
import { UsersRepository } from '@backend/repository/UsersRepository';

export type CustomContext = {
  db: MySql2Database<Record<string, unknown>>;
  authUser: JWTPayload | null;
  usersRepository: UsersRepository;
  proceedingsRepository: ProceedingsRepository;
  messageRepository: MessagesRepository;
};

export type JWTPayload = {
  id: number;
  iat: number;
  email?: string;
  userId: number;
};
