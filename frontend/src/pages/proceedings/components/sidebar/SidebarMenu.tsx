import { HamburgerIcon } from '@chakra-ui/icons';
import {
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Show,
} from '@chakra-ui/react';

import { RouterNavLink } from '@frontend/components/navigation/atoms';
import { Routes } from '@frontend/routes';

import { RouterSidebarButton } from './RouterSidebarButton';

type SidebarMenuProps = {
  id: string;
};

export const SidebarMenu = ({ id }: SidebarMenuProps) => {
  const insertIdToUrl = (url: string) => {
    return url.replace(':id', id);
  };

  return (
    <>
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
                to={insertIdToUrl(Routes.proceedingsOverview)}
                width="full"
              >
                Přehled
              </RouterNavLink>
            </MenuItem>
            <MenuItem>
              <RouterNavLink
                to={insertIdToUrl(Routes.proceedingsParticipants)}
                width="full"
              >
                Účastníci
              </RouterNavLink>
            </MenuItem>
            <MenuItem>
              <RouterNavLink
                to={insertIdToUrl(Routes.proceedingsFiles)}
                width="full"
              >
                Soubory
              </RouterNavLink>
            </MenuItem>
            <MenuItem>
              <RouterNavLink
                to={insertIdToUrl(Routes.proceedingsChat)}
                width="full"
              >
                Chat
              </RouterNavLink>
            </MenuItem>
            <MenuItem>
              <RouterNavLink
                to={insertIdToUrl(Routes.proceedingsAssets)}
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
            to={insertIdToUrl(Routes.proceedingsOverview)}
            width="full"
            mt="10"
          >
            Přehled
          </RouterSidebarButton>
          <RouterSidebarButton
            to={insertIdToUrl(Routes.proceedingsParticipants)}
            width="full"
          >
            Účastníci
          </RouterSidebarButton>
          <RouterSidebarButton
            to={insertIdToUrl(Routes.proceedingsFiles)}
            width="full"
          >
            Soubory
          </RouterSidebarButton>
          <RouterSidebarButton
            to={insertIdToUrl(Routes.proceedingsChat)}
            width="full"
          >
            Chat
          </RouterSidebarButton>
          <RouterSidebarButton
            to={insertIdToUrl(Routes.proceedingsAssets)}
            width="full"
          >
            Rozvrh majetku
          </RouterSidebarButton>
        </Flex>
      </Show>
    </>
  );
};
