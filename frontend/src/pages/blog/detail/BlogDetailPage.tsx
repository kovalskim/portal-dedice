import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import {
  Alert,
  AlertIcon,
  Box,
  Card,
  Flex,
  Heading,
  Icon,
  Image,
  SimpleGrid,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { FaEdit, FaRegCalendarAlt, FaTrash } from 'react-icons/fa';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { PrimaryButton } from '@frontend/components/buttons';
import { Role, useAuth } from '@frontend/context/auth/auth-core';
import {
  GET_BLOG_BY_ID,
  GetBlogByIdResponse,
} from '@frontend/gql/blog/queries.ts';
import { Routes } from '@frontend/routes/routes';
import { insertIdToUrl } from '@frontend/utils/generalUtil';

import { DeleteBlogModal } from './DeleteBlogModal';

const sanitizeWithDOM = (html: string) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const elements = doc.body.querySelectorAll('*');

  elements.forEach((el) => el.removeAttribute('style'));

  return doc.body.innerHTML;
};

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

          <Flex align="center" justifyContent="center" color="gray.500" mb={4}>
            <Icon as={FaRegCalendarAlt} boxSize={4} mr={2} />
            <Text>{new Date(blog.blogDate).toLocaleDateString()}</Text>
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
          <Box>
            <Heading fontSize="lg" mb={4} mt={10}>
              Mohlo by vás také zajímat:
            </Heading>
            <SimpleGrid
              spacing={4}
              templateColumns="repeat(auto-fill, minmax(300px, 1fr))"
            >
              {relatedBlogs.map((related) => (
                <Card
                  key={related.id}
                  as={Link}
                  to={`/blog/${related.id}`}
                  _hover={{ textDecoration: 'none', transform: 'scale(1.02)' }}
                  transition="transform 0.2s"
                  p={4}
                >
                  <Box mb={2}>
                    <Image
                      src={related.coverImageFullAWSPath}
                      alt={related.title}
                      borderRadius="md"
                      height="200px"
                      width="100%"
                      objectFit="cover"
                    />
                    <Heading mt={4} mb={2} size="sm">
                      {related.title}
                    </Heading>
                  </Box>
                  <Flex
                    align="center"
                    justifyContent="center"
                    color="gray.500"
                    fontSize="14px"
                    mb={3}
                  >
                    <Icon as={FaRegCalendarAlt} boxSize={4} mr={2} />
                    <Text>{new Date(blog.blogDate).toLocaleDateString()}</Text>
                  </Flex>
                  <Box
                    dangerouslySetInnerHTML={{
                      __html: sanitizeWithDOM(related.content),
                    }}
                    style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      fontSize: '14px',
                    }}
                  />
                </Card>
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
