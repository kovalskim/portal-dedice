import { MouseEventHandler } from 'react';
import {
  AtSignIcon,
  ChevronDownIcon,
  Divider,
  MinusIcon,
} from '@chakra-ui/icons';
import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useBreakpointValue,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

import { RouterLink } from '@frontend/components/navigation/atoms/RouterLink.tsx';
import { RouterNavButton } from '@frontend/components/navigation/atoms/RouterNavButton.tsx';
import { useAuth } from '@frontend/context/auth';
import { useCustomToast } from '@frontend/hooks/useCustomToast.ts';
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
        <RouterLink to={Routes.profile} textColor="black" noUnderline>
          <MenuItem icon={<AtSignIcon />}>Můj profil</MenuItem>
        </RouterLink>
        <Divider></Divider>
        <MenuItem
          icon={<MinusIcon />}
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
