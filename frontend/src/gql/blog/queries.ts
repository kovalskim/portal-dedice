import { gql } from '@apollo/client';

export type GetBlogByIdResponse = {
  getBlogById: {
    id: number;
    title: string;
    content: string;
    coverImagePath: string;
    blogDate: string;
    coverImageFullAWSPath: string;
    additionalBlogs: {
      id: number;
      title: string;
      coverImageFullAWSPath: string;
      content: string;
    }[];
  };
};

export const GET_BLOG_BY_ID = gql`
  query GetBlogById($id: Float!) {
    getBlogById(id: $id) {
      id
      title
      content
      coverImagePath
      blogDate
      coverImageFullAWSPath
      additionalBlogs {
        id
        title
        coverImageFullAWSPath
        content
      }
    }
  }
`;
