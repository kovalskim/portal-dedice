import { AddIcon } from '@chakra-ui/icons';
import {
  Box,
  Card,
  Flex,
  Heading,
  Image,
  SimpleGrid,
  Text,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

import { PrimaryButton } from '@frontend/components/buttons';
import { RouterNavButton } from '@frontend/components/navigation/atoms/RouterNavButton';
import { Role, useAuth } from '@frontend/context/auth/auth-core';
import { Routes } from '@frontend/routes/routes';
import { insertIdToUrl } from '@frontend/utils/generalUtil';

const mockArticles = [
  {
    id: 1,
    coverImage: 'https://via.placeholder.com/300',
    title: 'Co je dědické řízení?',
    description:
      'Podívejte se na základní informace o tom, co obnáší dědické řízení a jak probíhá.',
  },
  {
    id: 2,
    coverImage: 'https://via.placeholder.com/300',
    title: 'Jaké dokumenty jsou potřeba?',
    description:
      'Zjistěte, jaké dokumenty budete potřebovat během dědického řízení.',
  },
  {
    id: 3,
    coverImage: 'https://via.placeholder.com/300',
    title: 'Průvodce pro dědice',
    description:
      'Kompletní průvodce pro dědice, kteří si nejsou jistí, co očekávat.',
  },
  {
    id: 4,
    coverImage: 'https://via.placeholder.com/300',
    title: 'Tipy od notáře',
    description: 'Praktické tipy od notáře, které vám usnadní celý proces.',
  },
  {
    id: 5,
    coverImage: 'https://via.placeholder.com/300',
    title: 'Časté chyby',
    description:
      'Seznam častých chyb, kterým se během dědického řízení vyhnout.',
  },
];

export const BlogPage = () => {
  const { role } = useAuth();
  const navigate = useNavigate();

  return (
    <Flex direction="column" gap={4} py={{ sm: 2, lg: 4 }} align="center">
      <Heading as="h2" size="lg" textAlign="center" mb={2}>
        Mohlo by vás zajímat
      </Heading>
      {role === Role.ADMIN && (
        <Flex justifyContent="flex-end" mt={4} width="100%">
          <PrimaryButton
            leftIcon={<AddIcon />}
            onClick={() => {
              navigate(Routes.createBlog);
            }}
          >
            Přidat článek
          </PrimaryButton>
        </Flex>
      )}

      <Card width="100%">
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} p={4}>
          {mockArticles.map((article) => (
            <Box
              key={article.id}
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
            >
              <Image src={article.coverImage} alt={article.title} />
              <Box p={4}>
                <Heading size="md" noOfLines={1}>
                  {article.title}
                </Heading>
                <Text noOfLines={3}>{article.description}</Text>
                <RouterNavButton
                  to={insertIdToUrl(Routes.blogDetail, article.id)}
                  size="sm"
                  mt={4}
                >
                  Detail
                </RouterNavButton>
              </Box>
            </Box>
          ))}
        </SimpleGrid>
      </Card>
    </Flex>
  );
};
