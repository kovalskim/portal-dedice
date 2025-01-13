import { Box, Card, Flex, Heading, Image, Text } from '@chakra-ui/react';

import { RouterLink } from '@frontend/components/navigation/atoms';
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
  return (
    <Card
      key={article.id}
      borderRadius="lg"
      overflow="hidden"
      display="flex"
      flexDirection={{ base: 'column', md: horizontal ? 'row' : 'column' }}
      justifyContent="space-between"
      _hover={{ transform: 'scale(1.013)' }}
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
          <RouterLink
            to={insertIdToUrl(Routes.blogDetail, article.id)}
            color="blackAlpha.800"
            textUnderlineOffset="3px"
          >
            {article.title}
          </RouterLink>
        </Heading>
        <Text mb={1} fontSize="xs" color={'gray.500'}>
          {formatDate(article.blogDate)}
        </Text>
        <Text
          noOfLines={3}
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(article.content) }}
        />
        <RouterLink
          to={insertIdToUrl(Routes.blogDetail, article.id)}
          pt={3}
          fontSize="md"
          textUnderlineOffset="3px"
        >
          Číst článek →
        </RouterLink>
      </Flex>
    </Card>
  );
};
