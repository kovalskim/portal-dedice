import { desc, eq } from 'drizzle-orm';
import { MySql2Database } from 'drizzle-orm/mysql2';

import { files, users } from '@backend/db/schema';
import { File } from '@backend/graphql/modules/file/fileType';

export class FilesRepository {
  db: MySql2Database<Record<string, unknown>>;

  constructor(db: MySql2Database<Record<string, unknown>>) {
    this.db = db;
  }

  async findFilesByProceedingId(proceedingId: number): Promise<File[]> {
    const rows = await this.db
      .select({
        files,
        users,
      })
      .from(files)
      .innerJoin(users, eq(files.userId, users.id))
      .where(eq(files.proceedingId, proceedingId))
      .orderBy(desc(files.timestamp));

    return rows.map((row) => ({
      id: row.files.id,
      path: row.files.path,
      timestamp: row.files.timestamp.toISOString(),
      alias: row.files.alias,
      type: row.files.type,
      user: {
        ...row.users,
      },
      proceedingId: row.files.proceedingId,
    }));
  }

  async getFileById(id: number) {
    const [file] = await this.db.select().from(files).where(eq(files.id, id));
    return file;
  }

  async deleteFile(id: number) {
    await this.db.delete(files).where(eq(files.id, id));
  }

  async saveFile(
    proceedingId: number,
    alias: string,
    type: string,
    userId: number,
    key: string,
  ) {
    const resultingIds = await this.db
      .insert(files)
      .values({
        path: key,
        userId: userId,
        alias: alias,
        proceedingId: proceedingId,
        type: type,
      })
      .$returningId();

    return resultingIds[0].id;
  }
}
