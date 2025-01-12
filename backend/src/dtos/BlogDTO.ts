export interface BlogDTO {
  id: number;
  title: string;
  content: string;
  coverImagePath: string;
  coverImageFullAWSPath: string;
  blogDate: Date;
  authorId: number;
  authorName?: string;
  createdAt: Date;
  updatedAt: Date;
  additionalBlogs?: BlogDTO[];
}
