import { MouseEventHandler } from 'react';
import { ChevronDownIcon, Divider, SettingsIcon } from '@chakra-ui/icons';
import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useBreakpointValue,
} from '@chakra-ui/react';
import { FaList, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import { RouterLink } from '@frontend/components/navigation/atoms/RouterLink.tsx';
import { RouterNavButton } from '@frontend/components/navigation/atoms/RouterNavButton.tsx';
import { useAuth } from '@frontend/context/auth';
import { useCustomToast } from '@frontend/hooks/useCustomToast.ts';
import { Routes } from '@frontend/routes/routes.ts';

type AuthButtonProps = {
  onClose: MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
};

export const AuthButton = ({ onClose }: AuthButtonProps) => {
  const { user, signOut } = useAuth();
  const navButtonlabel = useBreakpointValue({
    base: 'Přihlásit se',
    md: 'Přihlásit se do Portálu dědice',
  });

  const navigate = useNavigate();
  const showToast = useCustomToast();

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
        <RouterLink to={Routes.proceedings} textColor="black" noUnderline>
          <MenuItem icon={<FaList />}>Seznam řízení</MenuItem>
        </RouterLink>
        <RouterLink to={Routes.profile} textColor="black" noUnderline>
          <MenuItem icon={<SettingsIcon />}>Nastavení profilu</MenuItem>
        </RouterLink>
        <Divider></Divider>
        <MenuItem
          icon={<FaSignOutAlt />}
          onClick={() => {
            signOut();
            showToast({
              title: 'Odhlášení',
              description: 'Byli jste úspěšně odhlášeni.',
              status: 'success',
            });
            navigate(Routes.logIn);
          }}
        >
          Odhlásit se
        </MenuItem>
      </MenuList>
    </Menu>
  );
};
