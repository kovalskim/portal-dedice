import { desc, eq } from 'drizzle-orm';
import { MySql2Database } from 'drizzle-orm/mysql2';

import { blogs, users } from '@backend/db/schema';
import { BlogDTO } from '@backend/modules/blog/dtos/BlogDTO';
import { CreateBlogDTO } from '@backend/modules/blog/dtos/CreateBlogDTO';

export class BlogRepository {
  db: MySql2Database<Record<string, unknown>>;

  constructor(db: MySql2Database<Record<string, unknown>>) {
    this.db = db;
  }

  async getAllArticles(): Promise<BlogDTO[]> {
    const results = await this.db
      .select({
        id: blogs.id,
        title: blogs.title,
        content: blogs.content,
        authorId: blogs.authorId,
        blogDate: blogs.blogDate,
        createdAt: blogs.createdAt,
        updatedAt: blogs.updatedAt,
        viewersCount: blogs.viewersCount,
        coverImagePath: blogs.coverImagePath,
        authorName: users.firstname,
      })
      .from(blogs)
      .leftJoin(users, eq(blogs.authorId, users.id))
      .orderBy(desc(blogs.blogDate));

    return results as BlogDTO[];
  }

  async getMostViewedArticles(count: number): Promise<BlogDTO[]> {
    const results = await this.db
      .select({
        id: blogs.id,
        title: blogs.title,
        content: blogs.content,
        authorId: blogs.authorId,
        blogDate: blogs.blogDate,
        createdAt: blogs.createdAt,
        updatedAt: blogs.updatedAt,
        viewersCount: blogs.viewersCount,
        coverImagePath: blogs.coverImagePath,
        authorName: users.firstname,
      })
      .from(blogs)
      .leftJoin(users, eq(blogs.authorId, users.id))
      .orderBy(desc(blogs.viewersCount))
      .limit(count);

    return results as BlogDTO[];
  }

  async getLimitedBlogs(limit: number): Promise<BlogDTO[]> {
    const results = await this.db
      .select({
        id: blogs.id,
        title: blogs.title,
        content: blogs.content,
        authorId: blogs.authorId,
        blogDate: blogs.blogDate,
        createdAt: blogs.createdAt,
        updatedAt: blogs.updatedAt,
        viewersCount: blogs.viewersCount,
        coverImagePath: blogs.coverImagePath,
        authorName: users.firstname,
      })
      .from(blogs)
      .leftJoin(users, eq(blogs.authorId, users.id))
      .orderBy(desc(blogs.blogDate))
      .limit(limit);

    return results as BlogDTO[];
  }

  async getBlogById(blogId: number): Promise<BlogDTO | null> {
    const result = await this.db
      .select({
        id: blogs.id,
        title: blogs.title,
        content: blogs.content,
        authorId: blogs.authorId,
        blogDate: blogs.blogDate,
        createdAt: blogs.createdAt,
        updatedAt: blogs.updatedAt,
        viewersCount: blogs.viewersCount,
        coverImagePath: blogs.coverImagePath,
        authorName: users.firstname,
      })
      .from(blogs)
      .leftJoin(users, eq(blogs.authorId, users.id))
      .where(eq(blogs.id, blogId));

    return result.length ? (result[0] as BlogDTO) : null;
  }

  async createBlog(blogData: CreateBlogDTO): Promise<number> {
    const newBlog = await this.db.insert(blogs).values(blogData).$returningId();

    return newBlog[0].id;
  }

  async updateBlog(blogId: number, data: CreateBlogDTO): Promise<void> {
    await this.db.update(blogs).set(data).where(eq(blogs.id, blogId));
  }

  async deleteBlog(blogId: number): Promise<void> {
    await this.db.delete(blogs).where(eq(blogs.id, blogId));
  }
}
