import { Box, Flex } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';

import { Link } from '@frontend/components/links';
import { Proceeding } from '@frontend/gql/proceedings/queries.ts';
import { Routes } from '@frontend/routes/routes.ts';

import { SidebarMenu } from './SidebarMenu';
import { SidebarProceedingsInfo } from './SidebarProceedingsInfo';

type SidebarProps = {
  proceeding: Proceeding;
};

export const Sidebar = ({ proceeding }: SidebarProps) => {
  const { id } = useParams();

  return (
    <Box>
      <Link fontSize="md" href={Routes.proceedings}>
        {'← Zpět na seznam dědických řízení'}
      </Link>
      <Flex
        direction={{ base: 'row', md: 'column' }}
        justifyContent={{ base: 'space-between', md: 'inherit' }}
      >
        <SidebarProceedingsInfo proceeding={proceeding} />
        <SidebarMenu id={Number(id) ?? ''} />
      </Flex>
    </Box>
  );
};
