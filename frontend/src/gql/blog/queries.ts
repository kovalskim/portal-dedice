import { gql } from '@apollo/client';

export type GetBlogByIdResponse = {
  getBlogById: {
    id: number;
    title: string;
    content: string;
    coverImagePath: string;
    blogDate: string;
    coverImageFullAWSPath: string;
    viewersCount: number;
    additionalBlogs: {
      id: number;
      title: string;
      coverImageFullAWSPath: string;
      content: string;
      blogDate: string;
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
      viewersCount
      additionalBlogs {
        id
        title
        coverImageFullAWSPath
        content
        blogDate
      }
    }
  }
`;

export type Article = {
  authorName: string;
  blogDate: string;
  content: string;
  coverImageFullAWSPath: string;
  createdAt: string;
  id: number;
  title: string;
  viewersCount: number;
};

export type GetArticlesResponse = {
  getAllArticles: Article[];
};

export const GET_ALL_ARTICLES = gql`
  query GetAllArticles {
    getAllArticles {
      authorName
      blogDate
      content
      coverImageFullAWSPath
      createdAt
      id
      title
      viewersCount
    }
  }
`;

export type GetMostViewedArticlesResponse = {
  getMostViewedArticles: Article[];
};

export const GET_MOST_VIEWED_ARTICLES = gql`
  query GetMostViewedArticles($count: Float!) {
    getMostViewedArticles(count: $count) {
      authorName
      blogDate
      content
      coverImageFullAWSPath
      createdAt
      id
      title
      viewersCount
    }
  }
`;
