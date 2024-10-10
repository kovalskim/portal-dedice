import { Box, Flex } from '@chakra-ui/layout';

import { Footer } from '@frontend/shared/design-system';
import { TopNavigation } from '@frontend/shared/navigation/organisms/TopNavigation';

type MainLayoutProps = {
  children: React.ReactNode;
};

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <Flex direction="column" flex="1">
      <TopNavigation />
      <Box flex="1" bgColor="gray.50">
        {children}
      </Box>
      <Footer />
    </Flex>
  );
};
