import { AppError } from '@backend/errors/AppError';
import { BlogDTO } from '@backend/modules/blog/dtos/BlogDTO';
import { CreateBlogInputDTO } from '@backend/modules/blog/dtos/CreateBlogInputDTO';
import { BlogRepository } from '@backend/modules/blog/repositories/BlogRepository';
import { AwsService } from '@backend/modules/files/services/AwsService';
import { UserService } from '@backend/modules/users/services/UserService';

export class BlogService {
  private readonly blogRepository: BlogRepository;
  private readonly awsService: AwsService;
  private readonly userService: UserService;

  constructor(
    blogRepository: BlogRepository,
    awsService: AwsService,
    userService: UserService,
  ) {
    this.blogRepository = blogRepository;
    this.awsService = awsService;
    this.userService = userService;
  }

  getBlogKey(filename: string): string {
    return `blogsImages/coverImages/${filename}`;
  }

  async getAllArticles(): Promise<BlogDTO[]> {
    const blogs = await this.blogRepository.getLimitedBlogs(4);

    for (const blog of blogs) {
      blog.coverImageFullAWSPath = await this.awsService.getFilePath(
        this.getBlogKey(blog.coverImagePath),
      );
    }

    return blogs;
  }

  async getMostViewedArticles(count: number): Promise<BlogDTO[]> {
    const blogs = await this.blogRepository.getMostViewedArticles(count);

    for (const blog of blogs) {
      blog.coverImageFullAWSPath = await this.awsService.getFilePath(
        this.getBlogKey(blog.coverImagePath),
      );
    }

    return blogs;
  }

  async getRelatedBlogs(blogId: number): Promise<BlogDTO[]> {
    const blogs = await this.blogRepository.getLimitedBlogs(4);

    const filteredBlogs = blogs
      .filter((blog) => blog.id !== blogId)
      .slice(0, 3);

    for (const blog of filteredBlogs) {
      blog.coverImageFullAWSPath = await this.awsService.getFilePath(
        this.getBlogKey(blog.coverImagePath),
      );
    }

    return filteredBlogs;
  }

  async getBlogById(blogId: number): Promise<BlogDTO | null> {
    let blog = await this.blogRepository.getBlogById(blogId);

    if (!blog) {
      throw new AppError('NOT_FOUND', 'Blog not found');
    }

    blog.coverImageFullAWSPath = await this.awsService.getFilePath(
      this.getBlogKey(blog.coverImagePath),
    );
    blog.additionalBlogs = await this.getRelatedBlogs(blogId);

    return blog;
  }

  async createBlog(
    userId: number,
    input: CreateBlogInputDTO,
  ): Promise<BlogDTO> {
    if (!(await this.userService.hasUserAdminRole(userId))) {
      throw new AppError(
        'UNAUTHORIZED',
        'User must be logged in and be admin to create a blog',
      );
    }

    const newBlogId = await this.blogRepository.createBlog({
      ...input,
      blogDate: new Date(input.blogDate),
      authorId: userId,
    });

    const newBlog = await this.blogRepository.getBlogById(newBlogId);
    if (!newBlog) {
      throw new AppError('FAILED_TO_CREATE', 'Failed to create the blog');
    }

    return newBlog;
  }

  async updateBlog(
    userId: number,
    blogId: number,
    input: CreateBlogInputDTO,
  ): Promise<BlogDTO> {
    if (!(await this.userService.hasUserAdminRole(userId))) {
      throw new AppError(
        'UNAUTHORIZED',
        'User must be logged in and be admin to update a blog',
      );
    }

    const existingBlog = await this.blogRepository.getBlogById(blogId);
    if (!existingBlog) {
      throw new AppError('NOT_FOUND', 'Blog not found');
    }

    try {
      await this.blogRepository.updateBlog(blogId, {
        ...input,
        blogDate: new Date(input.blogDate),
        authorId: userId,
      });
    } catch {
      throw new AppError('FAILED_TO_UPDATE', 'Failed to update the blog');
    }

    const updatedBlog = await this.blogRepository.getBlogById(blogId);
    if (!updatedBlog) {
      throw new AppError('NOT_FOUND', 'Updated blog was not found');
    }

    if (existingBlog.coverImagePath !== input.coverImagePath) {
      await this.awsService.deleteFile(
        this.getBlogKey(existingBlog.coverImagePath),
      );
    }

    return updatedBlog;
  }

  async deleteBlog(userId: number, blogId: number): Promise<boolean> {
    if (!(await this.userService.hasUserAdminRole(userId))) {
      throw new AppError(
        'UNAUTHORIZED',
        'User must be logged in and be admin to delete a blog',
      );
    }

    const existingBlog = await this.blogRepository.getBlogById(blogId);
    if (!existingBlog) {
      throw new AppError('NOT_FOUND', 'Blog not found');
    }

    try {
      await this.blogRepository.deleteBlog(blogId);
    } catch (error) {
      throw new AppError('FAILED_TO_DELETE', 'Failed to delete file');
    }

    const deletedBlog = await this.blogRepository.getBlogById(blogId);
    if (deletedBlog) {
      throw new AppError(
        'FAILED_TO_DELETE',
        'Failed to delete the blog - the blog is still present',
      );
    }

    await this.awsService.deleteFile(
      this.getBlogKey(existingBlog.coverImagePath),
    );

    return true;
  }

  async increaseViewersCount(blogId: number): Promise<void> {
    const blog = await this.blogRepository.getBlogById(blogId);
    if (!blog) {
      throw new AppError('NOT_FOUND', 'Blog not found');
    }

    await this.blogRepository.updateBlog(blogId, {
      ...blog,
      viewersCount: blog.viewersCount + 1,
    });
  }

  async getCoverImgSignedUrl(
    filename: string,
    filetype: string,
  ): Promise<string> {
    const key = this.getBlogKey(filename);

    return await this.awsService.getUploadUrl(key, filetype);
  }
}
