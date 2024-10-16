import { Box, Flex } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';

import { Link } from '@frontend/components/links';

import { SidebarMenu } from './SidebarMenu';
import { SidebarProceedingsInfo } from './SidebarProceedingsInfo';

export const Sidebar = () => {
  const { id } = useParams();

  return (
    <Box>
      <Link fontSize="sm">{'← Zpět na seznam dědických řízení'}</Link>
      <Flex
        direction={{ base: 'row', md: 'column' }}
        justifyContent={{ base: 'space-between', md: 'inherit' }}
      >
        <SidebarProceedingsInfo id={id ?? ''} />
        <SidebarMenu id={id ?? ''} />
      </Flex>
    </Box>
  );
};
