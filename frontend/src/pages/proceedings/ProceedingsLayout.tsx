import { Flex } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';

import { Sidebar } from './components/sidebar/Sidebar';

export const ProceedingsLayout = () => {
  return (
    <Flex
      height="full"
      direction={{ base: 'column', md: 'row' }}
      px={{ base: 4, md: 10 }}
      py={{ base: 4, md: 5 }}
      gap={{ base: 3, md: 6 }}
    >
      <Sidebar />
      <Outlet />
    </Flex>
  );
};
