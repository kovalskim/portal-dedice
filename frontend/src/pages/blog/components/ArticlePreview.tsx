import { Box, Card, Flex, Heading, Image, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

import { Article } from '@frontend/gql/blog/queries';
import { Routes } from '@frontend/routes/routes';
import {
  formatDate,
  insertIdToUrl,
  sanitizeHtml,
} from '@frontend/utils/generalUtil';

export interface ArticlePreviewProps {
  article: Pick<
    Article,
    'id' | 'title' | 'content' | 'coverImageFullAWSPath' | 'blogDate'
  >;
  horizontal?: boolean;
}

export const ArticlePreview: React.FC<ArticlePreviewProps> = ({
  article,
  horizontal,
}) => {
  const navigate = useNavigate();

  return (
    <Card
      key={article.id}
      // borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      display="flex"
      flexDirection={{ base: 'column', md: horizontal ? 'row' : 'column' }}
      justifyContent="space-between"
      cursor="pointer"
      onClick={() => navigate(insertIdToUrl(Routes.blogDetail, article.id))}
      _hover={{ transform: 'scale(1.015)' }}
      transition={'transform 0.2s'}
    >
      <Box flex={horizontal ? 1 : 'none'} height="200px" width="100%">
        <Image
          src={article.coverImageFullAWSPath}
          alt={article.title}
          objectFit="cover"
          height="full"
          width="full"
        />
      </Box>
      <Flex
        p={4}
        flex={3}
        justifyContent="space-between"
        flexDirection="column"
      >
        <Heading size="md" mb={1}>
          {article.title}
        </Heading>
        <Text mb={1} fontSize="xs" color={'gray.500'}>
          {formatDate(article.blogDate)}
        </Text>
        <Text
          noOfLines={3}
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(article.content) }}
        />
        <Text pt={3} textColor="gray.500" fontSize="sm">
          Číst článek →
        </Text>
      </Flex>
    </Card>
  );
};
