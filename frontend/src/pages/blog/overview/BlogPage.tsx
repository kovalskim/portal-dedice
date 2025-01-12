import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { AddIcon, Divider } from '@chakra-ui/icons';
import {
  Box,
  Flex,
  Heading,
  SimpleGrid,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

import { PrimaryButton, SecondaryButton } from '@frontend/components/buttons';
import { Role, useAuth } from '@frontend/context/auth/auth-core';
import {
  GET_ALL_ARTICLES,
  GET_MOST_VIEWED_ARTICLES,
  GetArticlesResponse,
  GetMostViewedArticlesResponse,
} from '@frontend/gql/blog/queries';
import { useCustomToast } from '@frontend/hooks/useCustomToast';
import { Routes } from '@frontend/routes/routes';

import { ArticlePreview } from '../components/ArticlePreview';

import styles from './BlogPage.module.css';

export const BlogPage = () => {
  const { role } = useAuth();
  const navigate = useNavigate();
  const showToast = useCustomToast();

  const [showedArticles, setShowedArticles] = useState(5);

  const handleLoadMore = () => {
    setShowedArticles((prev) => prev + 5);
  };

  const { data: allArticles, loading: allArticlesLoading } =
    useQuery<GetArticlesResponse>(GET_ALL_ARTICLES, {
      onError: () => {
        showToast({
          title: 'Něco se pokazilo',
          description:
            'Nepodařilo se načíst nejčtenější články. Zkuste to prosím znovu.',
          status: 'error',
        });
      },
    });

  const { data: popularArticles, loading: popularArticlesLoading } =
    useQuery<GetMostViewedArticlesResponse>(GET_MOST_VIEWED_ARTICLES, {
      variables: { count: 3 },
      onError: () => {
        showToast({
          title: 'Něco se pokazilo',
          description: 'Nepodařilo se načíst články. Zkuste to prosím znovu.',
          status: 'error',
        });
      },
    });

  return (
    <Flex direction="column" gap={4} py={{ sm: 2, lg: 4 }} align="center">
      <Heading as="h2" size="lg" textAlign="left" mb={6}>
        Dědicův blogísek
      </Heading>
      {role === Role.ADMIN && (
        <Flex justifyContent="flex-end" width="100%">
          <PrimaryButton
            leftIcon={<AddIcon />}
            onClick={() => {
              navigate(Routes.createBlog);
            }}
          >
            Vytvořit nový článek
          </PrimaryButton>
        </Flex>
      )}

      <Box width="100%">
        <Heading as="h3" size="md" textAlign="center" mb={4}>
          Nejčtenější články
        </Heading>
        {!popularArticlesLoading && popularArticles ? (
          <SimpleGrid
            columns={{ base: 1, md: 3, lg: 3 }}
            spacing={6}
            p={4}
            className={styles.popularArticlesWrapper}
          >
            {popularArticles.getMostViewedArticles.map((article) => (
              <ArticlePreview key={article.id} article={article} />
            ))}
          </SimpleGrid>
        ) : (
          <Flex width="full" justifyContent="center" gap={10} mt={4}>
            <Spinner size="md" color="goldenYellow.500" />
            <Text color="goldenYellow.500">Načítam články</Text>
          </Flex>
        )}

        <Divider my={8} />

        <Heading size="md" textAlign="center" mb={4}>
          Všechny články
        </Heading>
        {!allArticlesLoading && allArticles ? (
          <>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} p={4}>
              {allArticles.getAllArticles
                .toSorted((a, b) => (a.blogDate > b.blogDate ? -1 : 1))
                .slice(0, showedArticles)
                .map((article) => (
                  <ArticlePreview key={article.id} article={article} />
                ))}
            </SimpleGrid>
            <Flex justifyContent="center" m={4}>
              {showedArticles < allArticles.getAllArticles.length && (
                <SecondaryButton onClick={handleLoadMore}>
                  Načíst další
                </SecondaryButton>
              )}
            </Flex>
          </>
        ) : (
          <Flex width="full" justifyContent="center" gap={10} my={4}>
            <Spinner size="md" color="goldenYellow.500" />
            <Text color="goldenYellow.500">Načítam články</Text>
          </Flex>
        )}
      </Box>
    </Flex>
  );
};
