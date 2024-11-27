import { eq } from 'drizzle-orm';
import { MySql2Database } from 'drizzle-orm/mysql2';

import { messages, users } from '@backend/db/schema';
import { UserDTO } from '@backend/repository/UsersRepository';

interface MessageDTO {
  id: number;
  userId: number;
  proceedingId: number;
  text: string;
  timestamp: Date;
}

interface MessageWithUserDTO {
  id: number;
  userId: number;
  proceedingId: number;
  text: string;
  timestamp: Date;
  user: UserDTO;
}

export class MessagesRepository {
  constructor(private db: MySql2Database<Record<string, unknown>>) {}

  async getMessagesByProceedingId(proceedingId: number): Promise<MessageDTO[]> {
    return (await this.db
      .select()
      .from(messages)
      .where(eq(messages.proceedingId, proceedingId))
      .then((messages) => messages)) as MessageDTO[];
  }

  async getMessageById(messageId: number): Promise<MessageDTO | null> {
    const result = await this.db
      .select()
      .from(messages)
      .where(eq(messages.id, messageId))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    const message = result[0];
    return {
      id: message.id,
      userId: message.userId,
      proceedingId: message.proceedingId,
      text: message.text,
      timestamp: message.timestamp,
    } as MessageDTO;
  }

  async getMessagesWithUsersByProceedingId(
    proceedingId: number,
  ): Promise<MessageWithUserDTO[]> {
    return (await this.db
      .select()
      .from(messages)
      .leftJoin(users, eq(messages.userId, users.id))
      .where(eq(messages.proceedingId, proceedingId))
      .orderBy(messages.timestamp)
      .then((messages) =>
        messages.map((message) => {
          if (message.users === null) {
            return null;
          }
          return {
            ...message.messages,
            user: message.users,
          } as MessageWithUserDTO;
        }),
      )) as MessageWithUserDTO[];
  }

  async getMessageWithUserById(
    messageId: number,
  ): Promise<MessageWithUserDTO | null> {
    const result = await this.db
      .select()
      .from(messages)
      .leftJoin(users, eq(messages.userId, users.id))
      .where(eq(messages.id, messageId))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    const message = result[0];
    if (message.users === null) {
      return null;
    }
    return {
      ...message.messages,
      user: message.users,
    } as MessageWithUserDTO;
  }

  async createMessage(
    userId: number,
    proceedingId: number,
    text: string,
  ): Promise<number> {
    const message = await this.db
      .insert(messages)
      .values({
        userId,
        proceedingId,
        text,
      })
      .$returningId();

    return message[0].id;
  }
}
