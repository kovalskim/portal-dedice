import { gql } from '@apollo/client';

export type CreateBlogResponse = {
  createBlog: {
    id: number;
  };
};

export type UpdateBlogResponse = {
  updateBlog: {
    id: number;
  };
};

export type GetCoverImgSignedUrlResponse = {
  getCoverImgSignedUrl: {
    url: string;
  };
};

export const GET_COVER_IMG_SIGNED_URL_MUTATION = gql`
  mutation getCoverImgSignedUrl($filetype: String!, $filename: String!) {
    getCoverImgSignedUrl(filetype: $filetype, filename: $filename) {
      url
    }
  }
`;

export const CREATE_BLOG_MUTATION = gql`
  mutation createBlog(
    $title: String!
    $content: String!
    $coverImagePath: String!
    $blogDate: String!
  ) {
    createBlog(
      data: {
        title: $title
        content: $content
        coverImagePath: $coverImagePath
        blogDate: $blogDate
      }
    ) {
      id
    }
  }
`;

export const DELETE_BLOG_MUTATION = gql`
  mutation deleteBlog($id: Float!) {
    deleteBlog(id: $id)
  }
`;

export const UPDATE_BLOG_MUTATION = gql`
  mutation updateBlog($data: NewBlogInput!, $updateBlogId: Float!) {
    updateBlog(data: $data, id: $updateBlogId) {
      id
    }
  }
`;

export const INCREASE_VIEWERS_COUNT_MUTATION = gql`
  mutation IncreaseViewersCount($increaseViewersCountId: Float!) {
    increaseViewersCount(id: $increaseViewersCountId)
  }
`;
