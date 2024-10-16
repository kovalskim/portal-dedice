import { Button, ButtonProps } from '@chakra-ui/react';
import {
  NavLink as ReactRouterNavLink,
  type NavLinkProps as ReactRouterNavLinkProps,
} from 'react-router-dom';

type Props = Omit<ButtonProps, 'as'> & ReactRouterNavLinkProps;

export const RouterSidebarButton = (props: Props) => {
  return (
    <Button
      {...props}
      variant="ghost"
      as={ReactRouterNavLink}
      _hover={{
        bg: 'lightGray.500',
      }}
      _activeLink={{
        bg: 'goldenYellow.500',
        color: 'white',
      }}
    />
  );
};
