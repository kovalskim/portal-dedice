import { eq } from 'drizzle-orm';
import { MySql2Database } from 'drizzle-orm/mysql2';

import { messages, users } from '@backend/db/schema';
import { MessageDTO } from '@backend/dtos/MessageDTO';

export class MessageRepository {
  constructor(private db: MySql2Database<Record<string, unknown>>) {}

  async findMessagesByProceedingId(
    proceedingId: number,
  ): Promise<MessageDTO[]> {
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
          return message.messages as MessageDTO;
        }),
      )) as MessageDTO[];
  }

  async getMessageById(messageId: number): Promise<MessageDTO | null> {
    return await this.db
      .select()
      .from(messages)
      .where(eq(messages.id, messageId))
      .then((messages) => messages[0] as MessageDTO);
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
