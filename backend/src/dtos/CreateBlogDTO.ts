export interface CreateBlogDTO {
  title: string;
  content: string;
  coverImagePath: string;
  blogDate: Date;
  authorId: number;
  viewersCount?: number;
}
