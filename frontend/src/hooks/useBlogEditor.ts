import { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { useNavigate, useParams } from 'react-router-dom';
import slugify from 'slugify';

import {
  CREATE_BLOG_MUTATION,
  CreateBlogResponse,
  GET_COVER_IMG_SIGNED_URL_MUTATION,
  GetCoverImgSignedUrlResponse,
  UPDATE_BLOG_MUTATION,
  UpdateBlogResponse,
} from '@frontend/gql/blog/mutations';
import {
  GET_BLOG_BY_ID,
  GetBlogByIdResponse,
} from '@frontend/gql/blog/queries';
import { useCustomToast } from '@frontend/hooks/useCustomToast';
import { Routes } from '@frontend/routes/routes';
import { getFileNameWithoutExtension } from '@frontend/utils/fileUtil';
import { insertIdToUrl } from '@frontend/utils/generalUtil';

export const useBlogEditor = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const showToast = useCustomToast();
  const { id } = useParams<{ id?: string }>();
  const numericId = id ? Number(id) : undefined;
  const isEditMode = !!id;

  const { data, loading: queryLoading } = useQuery<GetBlogByIdResponse>(
    GET_BLOG_BY_ID,
    {
      variables: { id: numericId },
      skip: !isEditMode,
      onError: () => {
        navigate(Routes.blog);
        showToast({
          title: 'Nepodařilo se najít článek',
          status: 'error',
        });
      },
    },
  );

  const [createBlog] = useMutation<CreateBlogResponse>(CREATE_BLOG_MUTATION, {
    onCompleted: (data) => {
      showToast({ title: 'Článek byl úspěšně vytvořen', status: 'success' });
      navigate(insertIdToUrl(Routes.blogDetail, data.createBlog.id));
    },
    onError: () => {
      showToast({ title: 'Chyba při vytváření článku', status: 'error' });
    },
  });

  const [editBlog] = useMutation<UpdateBlogResponse>(UPDATE_BLOG_MUTATION, {
    onCompleted: (data) => {
      showToast({ title: 'Článek byl úspěšně upraven', status: 'success' });
      navigate(insertIdToUrl(Routes.blogDetail, data.updateBlog.id));
    },
    onError: () => {
      showToast({ title: 'Chyba při úpravě článku', status: 'error' });
    },
  });

  const [getCoverImgSignedUrl] = useMutation<GetCoverImgSignedUrlResponse>(
    GET_COVER_IMG_SIGNED_URL_MUTATION,
    {
      onError: () =>
        showToast({
          title: 'Nepodařilo se uložit soubor',
          description:
            'Při ukládání souboru k dědickému řízení se vyskytla chyba.',
          status: 'error',
        }),
    },
  );

  const uploadCoverImgToS3 = async (file: File): Promise<string> => {
    const fileType =
      file.type === 'image/png'
        ? 'png'
        : file.type === 'image/jpeg'
          ? 'jpeg'
          : 'unknown';

    const filename = `${slugify(
      getFileNameWithoutExtension(file.name),
    )}_${Date.now()}.${fileType}`;

    const response = await getCoverImgSignedUrl({
      variables: { filename, filetype: file.type },
    });

    if (!response.data || !response.data.getCoverImgSignedUrl?.url) {
      throw new Error(
        'Failed to retrieve the signed URL for uploading the image.',
      );
    }

    const signedUrl = response.data.getCoverImgSignedUrl.url;

    const uploadResponse = await fetch(signedUrl, {
      method: 'PUT',
      headers: { 'Content-Type': file.type },
      body: file,
    });

    if (!uploadResponse.ok) {
      throw new Error('Image upload failed.');
    }

    return filename;
  };

  const onSubmit = async (formData: {
    title: string;
    content: string;
    coverImage?: File;
    date: string;
  }) => {
    setIsLoading(true);
    try {
      let finalCoverImagePath = data?.getBlogById?.coverImagePath;

      if (formData.coverImage) {
        finalCoverImagePath = await uploadCoverImgToS3(formData.coverImage);
      }

      if (!finalCoverImagePath) {
        throw new Error('Blog must have a valid path to cover image');
      }

      if (isEditMode && numericId) {
        await editBlog({
          variables: {
            updateBlogId: numericId,
            data: {
              title: formData.title,
              content: formData.content,
              coverImagePath: finalCoverImagePath,
              blogDate: formData.date,
            },
          },
        });
      } else {
        await createBlog({
          variables: {
            title: formData.title,
            content: formData.content,
            coverImagePath: finalCoverImagePath,
            blogDate: formData.date,
          },
        });
      }
    } catch (error) {
      showToast({
        title: 'Chyba při ukládání článku',
        status: 'error',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { data, loading: queryLoading || isLoading, onSubmit };
};
