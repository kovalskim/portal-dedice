import { desc, eq } from 'drizzle-orm';
import { MySql2Database } from 'drizzle-orm/mysql2';

import { files } from '@backend/db/schema';
import { FileDTO } from '@backend/dtos/FileDTO';

export class FileRepository {
  db: MySql2Database<Record<string, unknown>>;

  constructor(db: MySql2Database<Record<string, unknown>>) {
    this.db = db;
  }

  async findFilesByProceedingId(proceedingId: number): Promise<FileDTO[]> {
    const rows = await this.db
      .select({
        files,
      })
      .from(files)
      .where(eq(files.proceedingId, proceedingId))
      .orderBy(desc(files.timestamp));

    return rows.map((row) => ({
      id: row.files.id,
      path: row.files.path,
      timestamp: row.files.timestamp.toISOString(),
      alias: row.files.alias,
      type: row.files.type,
      userId: row.files.userId,
      proceedingId: row.files.proceedingId,
    }));
  }

  async getFileById(id: number): Promise<FileDTO> {
    const [file] = await this.db.select().from(files).where(eq(files.id, id));
    return {
      id: file.id,
      path: file.path,
      timestamp: file.timestamp.toISOString(),
      alias: file.alias,
      type: file.type,
      userId: file.userId,
      proceedingId: file.proceedingId,
    };
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
