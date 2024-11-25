import { HamburgerIcon } from '@chakra-ui/icons';
import { Box } from '@chakra-ui/layout';
import {
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Show,
  Text,
} from '@chakra-ui/react';
import {
  FaChartPie,
  FaComments,
  FaFolderOpen,
  FaHome,
  FaUsers,
} from 'react-icons/fa';

import { RouterNavLink } from '@frontend/components/navigation/atoms';
import { Routes } from '@frontend/routes/routes.ts';
import { insertIdToUrl } from '@frontend/utils/util.tsx';

import { RouterSidebarButton } from './RouterSidebarButton';

type SidebarMenuProps = {
  id: number;
};

export const SidebarMenu = ({ id }: SidebarMenuProps) => {
  return (
    <Box mt={{ base: 0, md: 6 }}>
      <Show below="md">
        <Menu>
          <MenuButton
            as={IconButton}
            aria-label="Options"
            icon={<HamburgerIcon />}
            variant="outline"
          />
          <MenuList>
            <MenuItem>
              <RouterNavLink
                to={insertIdToUrl(Routes.proceedingOverview, id)}
                width="full"
              >
                Přehled
              </RouterNavLink>
            </MenuItem>
            <MenuItem>
              <RouterNavLink
                to={insertIdToUrl(Routes.proceedingParticipants, id)}
                width="full"
              >
                Účastníci
              </RouterNavLink>
            </MenuItem>
            <MenuItem>
              <RouterNavLink
                to={insertIdToUrl(Routes.proceedingFiles, id)}
                width="full"
              >
                Soubory
              </RouterNavLink>
            </MenuItem>
            <MenuItem>
              <RouterNavLink
                to={insertIdToUrl(Routes.proceedingChat, id)}
                width="full"
              >
                Chat
              </RouterNavLink>
            </MenuItem>
            <MenuItem>
              <RouterNavLink
                to={insertIdToUrl(Routes.proceedingAssets, id)}
                width="full"
              >
                Rozvrh majetku
              </RouterNavLink>
            </MenuItem>
          </MenuList>
        </Menu>
      </Show>

      <Show above="md">
        <Flex direction="column" gap={3}>
          <RouterSidebarButton
            to={insertIdToUrl(Routes.proceedingOverview, id)}
            width="full"
          >
            <FaHome />
            <Text ml={2}>Přehled</Text>
          </RouterSidebarButton>
          <RouterSidebarButton
            to={insertIdToUrl(Routes.proceedingParticipants, id)}
            width="full"
          >
            <FaUsers />
            <Text ml={2}>Účastníci</Text>
          </RouterSidebarButton>
          <RouterSidebarButton
            to={insertIdToUrl(Routes.proceedingFiles, id)}
            width="full"
          >
            <FaFolderOpen />
            <Text ml={2}>Soubory</Text>
          </RouterSidebarButton>
          <RouterSidebarButton
            to={insertIdToUrl(Routes.proceedingChat, id)}
            width="full"
          >
            <FaComments />
            <Text ml={2}>Chat</Text>
          </RouterSidebarButton>
          <RouterSidebarButton
            to={insertIdToUrl(Routes.proceedingAssets, id)}
            width="full"
          >
            <FaChartPie />
            <Text ml={2}>Rozvrh majetku</Text>
          </RouterSidebarButton>
        </Flex>
      </Show>
    </Box>
  );
};
