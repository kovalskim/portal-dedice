import { Box, Flex } from '@chakra-ui/layout';
import { Container } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';

import { Footer } from '../footer/Footer';
import { TopNavigation } from '../navigation/TopNavigation';

export const MainLayout = () => {
  return (
    <Flex direction="column" flex="1">
      <TopNavigation />
      <Box flex="1" bgColor="gray.50">
        <Container maxW="container.xl" py={{ base: 6, md: 12 }}>
          <Outlet />
        </Container>
      </Box>
      <Footer />
    </Flex>
  );
};
