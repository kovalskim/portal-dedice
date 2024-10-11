import { Box, Flex } from '@chakra-ui/layout';
import { Outlet } from 'react-router-dom';

import { Footer } from '../footer/Footer';
import { TopNavigation } from '../navigation/TopNavigation';

export const MainLayout = () => {
  return (
    <Flex direction="column" flex="1">
      <TopNavigation />
      <Box flex="1" bgColor="gray.50">
        <Outlet />
      </Box>
      <Footer />
    </Flex>
  );
};
