import { MouseEventHandler } from 'react';
import {
  AtSignIcon,
  ChevronDownIcon,
  Divider,
  MinusIcon,
  SettingsIcon,
} from '@chakra-ui/icons';
import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useBreakpointValue,
} from '@chakra-ui/react';

import { RouterLink } from '@frontend/components/navigation/atoms/RouterLink.tsx';
import { RouterNavButton } from '@frontend/components/navigation/atoms/RouterNavButton.tsx';
import { useAuth } from '@frontend/context/auth';
import { Routes } from '@frontend/routes.ts';

type AuthButtonProps = {
  onClose: MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
};

export const AuthButton = ({ onClose }: AuthButtonProps) => {
  const { user, signOut } = useAuth();
  const navButtonlabel = useBreakpointValue({
    base: 'Přihlásit se',
    md: 'Přihlásit se do Portálu dědice',
  });

  return user === null ? (
    <RouterNavButton to={Routes.logIn} onClick={onClose}>
      {navButtonlabel || ''}
    </RouterNavButton>
  ) : (
    <Menu>
      <MenuButton
        as={Button}
        rightIcon={<ChevronDownIcon />}
        colorScheme="goldenYellow"
      >
        {user.firstname} {user.lastname}
      </MenuButton>
      <MenuList>
        <RouterLink to={Routes.home} textColor="black" noUnderline>
          <MenuItem icon={<AtSignIcon />}>Můj profil</MenuItem>
        </RouterLink>
        <RouterLink to={Routes.home} textColor="black" noUnderline>
          <MenuItem icon={<SettingsIcon />}>Nastavení</MenuItem>
        </RouterLink>
        <Divider></Divider>
        <MenuItem icon={<MinusIcon />} onClick={signOut}>
          Odhlásit se
        </MenuItem>
      </MenuList>
    </Menu>
  );
};
