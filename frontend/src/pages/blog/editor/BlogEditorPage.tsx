import { CheckIcon } from '@chakra-ui/icons';
import { Box, Flex, Heading, Image, Spinner, VStack } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams } from 'react-router-dom';

import { PrimaryButton } from '@frontend/components/buttons';
import { InputField } from '@frontend/components/forms/fields/InputField';
import { SingleFileUploadField } from '@frontend/components/forms/fields/SingleFileUploadField';
import { WysiwygField } from '@frontend/components/forms/fields/WysiwygField';
import { Form } from '@frontend/components/forms/Form';
import { Role, useAuth } from '@frontend/context/auth/auth-core';
import { useBlogEditor } from '@frontend/hooks/useBlogEditor';
import { Routes } from '@frontend/routes/routes';

import { getSchema } from './schema';

export const BlogEditorPage = () => {
  const { role } = useAuth();
  const navigate = useNavigate();
  const { data, loading, onSubmit } = useBlogEditor();
  const { id } = useParams<{ id?: string }>();
  const isEditMode = !!id;

  const schema = getSchema(isEditMode);

  if (role !== Role.ADMIN) {
    navigate(Routes.blog);
  }

  if (loading)
    return (
      <Flex align="center" justify="center" minHeight="100vh" bg="gray.100">
        <Spinner size="xl" />
      </Flex>
    );

  return (
    <Box
      bg="white"
      py={8}
      px={6}
      borderRadius="md"
      shadow="md"
      maxWidth="800px"
      mx="auto"
    >
      <Heading mb={6}>
        {isEditMode ? 'Upravit článek' : 'Vytvořit článek'}
      </Heading>
      <Form
        id="blogEditorForm"
        resolver={zodResolver(schema)}
        defaultValues={{
          title: isEditMode ? data?.getBlogById.title : '',
          date:
            isEditMode && data?.getBlogById.blogDate
              ? new Date(data.getBlogById.blogDate).toISOString().split('T')[0]
              : new Date().toISOString().split('T')[0],
          coverImage: undefined,
          content: isEditMode ? data?.getBlogById.content : '',
        }} // Use prefilled values here
        onSubmit={onSubmit}
        noValidate
      >
        <VStack spacing={6} align="stretch">
          <Flex direction={{ base: 'column', md: 'row' }} mb="6" gap="5">
            <InputField
              name="title"
              label="Název článku"
              placeholder="Zadejte název článku"
            />
            <InputField
              name="date"
              label="Datum článku"
              placeholder="Datum článku"
              type="date"
            />
          </Flex>

          {data?.getBlogById.coverImageFullAWSPath && (
            <Box mb={4}>
              <Heading size="sm" mb={2}>
                Stávající obrázek
              </Heading>
              <Image
                src={data.getBlogById.coverImageFullAWSPath}
                alt="Stávající obrázek"
                borderRadius="md"
              />
            </Box>
          )}

          <SingleFileUploadField
            name="coverImage"
            label="Nahrát nový obrázek"
            accept="image/png,image/jpeg"
          />

          <WysiwygField
            name="content"
            label="Obsah článku"
            config={{ heightMin: 300 }}
          />

          <PrimaryButton
            type="submit"
            form="blogEditorForm"
            alignSelf="center"
            px={6}
            py={2}
            fontSize="md"
            leftIcon={<CheckIcon />}
            isLoading={loading}
          >
            {isEditMode ? 'Publikovat změny' : 'Publikovat'}
          </PrimaryButton>
        </VStack>
      </Form>
    </Box>
  );
};
