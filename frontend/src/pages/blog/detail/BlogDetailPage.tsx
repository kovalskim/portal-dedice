import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import {
  Alert,
  AlertIcon,
  Box,
  Flex,
  Heading,
  Icon,
  Image,
  SimpleGrid,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { FaEdit, FaEye, FaRegCalendarAlt, FaTrash } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';

import { PrimaryButton } from '@frontend/components/buttons';
import { Role, useAuth } from '@frontend/context/auth/auth-core';
import { INCREASE_VIEWERS_COUNT_MUTATION } from '@frontend/gql/blog/mutations';
import {
  GET_BLOG_BY_ID,
  GetBlogByIdResponse,
} from '@frontend/gql/blog/queries.ts';
import { Routes } from '@frontend/routes/routes';
import { insertIdToUrl } from '@frontend/utils/generalUtil';

import { ArticlePreview } from '../components/ArticlePreview';

import { DeleteBlogModal } from './DeleteBlogModal';

export const BlogDetailPage: React.FC = () => {
  const { role } = useAuth();
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const navigate = useNavigate();

  const openDeleteModal = () => setDeleteModalOpen(true);
  const closeDeleteModal = () => setDeleteModalOpen(false);

  const { id } = useParams<{ id: string }>();
  const numericId = Number(id);
  const { loading, data } = useQuery<GetBlogByIdResponse>(GET_BLOG_BY_ID, {
    variables: { id: numericId },
  });

  const [increaseViewersCount] = useMutation(INCREASE_VIEWERS_COUNT_MUTATION);

  useEffect(() => {
    increaseViewersCount({ variables: { increaseViewersCountId: numericId } });
  }, [increaseViewersCount, numericId]);

  if (loading)
    return (
      <Flex align="center" justify="center" minHeight="100vh" bg="gray.100">
        <Spinner size="xl" />
      </Flex>
    );
  if (!data || !data.getBlogById) {
    return (
      <Alert
        status="warning"
        left="50%"
        transform="translateX(-50%)"
        zIndex="1000"
        width="fit-content"
        borderRadius="md"
        boxShadow="md"
      >
        <AlertIcon />
        <Text>Článek nebyl nalezen. Zkuste zkontrolovat odkaz.</Text>
      </Alert>
    );
  }

  const blog = data.getBlogById;
  const relatedBlogs = data.getBlogById?.additionalBlogs || [];

  return (
    <Flex
      bg="gray.100"
      minHeight="100vh"
      justifyContent="center"
      alignItems="center"
    >
      <Box
        bg="white"
        width="100vw"
        minHeight="100vh"
        px={{ base: 4, md: 8, lg: 16 }}
        py={6}
        textAlign="center"
        borderRadius="md"
        shadow="md"
      >
        {role === Role.ADMIN && (
          <Flex justifyContent="flex-end" gap={4} mb={4}>
            <PrimaryButton
              colorScheme="blue"
              variant="outline"
              leftIcon={<Icon as={FaEdit} />}
              onClick={() => {
                navigate(insertIdToUrl(Routes.editBlog, id!));
              }}
            >
              Upravit
            </PrimaryButton>

            <PrimaryButton
              colorScheme="red"
              variant="outline"
              leftIcon={<Icon as={FaTrash} />}
              onClick={openDeleteModal}
            >
              Smazat
            </PrimaryButton>
          </Flex>
        )}

        <Box mb={8}>
          <Heading size="2xl" mb={6} p={4}>
            {blog.title}
          </Heading>

          <Flex
            align="center"
            justifyContent="center"
            color="gray.500"
            mb={4}
            gap={2}
          >
            <Icon as={FaRegCalendarAlt} boxSize={4} />
            <Text>{new Date(blog.blogDate).toLocaleDateString()}</Text>
            <Icon as={FaEye} boxSize={4} ml={4} />
            <Text>{blog.viewersCount}</Text>
          </Flex>

          <Image
            src={blog.coverImageFullAWSPath}
            alt={blog.title}
            borderRadius="md"
            mb={4}
            mx="auto"
            width="600px"
            maxWidth="100%"
            height="auto"
          />

          <Box
            px={{ base: 4, md: 8, lg: 16 }}
            textAlign="left"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </Box>

        {relatedBlogs.length > 0 && (
          <Box px={{ base: 4, md: 8, lg: 16 }}>
            <Heading fontSize="lg" mb={6} mt={10} textAlign="left">
              Mohlo by vás také zajímat:
            </Heading>
            <SimpleGrid
              spacing={4}
              templateColumns="repeat(auto-fill, minmax(300px, 1fr))"
              textAlign="left"
            >
              {relatedBlogs.map((related) => (
                <ArticlePreview key={related.id} article={related} />
              ))}
            </SimpleGrid>
          </Box>
        )}

        <DeleteBlogModal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          blogId={numericId}
        />
      </Box>
    </Flex>
  );
};
