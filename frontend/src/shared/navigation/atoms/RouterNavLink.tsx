import {
  NavLink as ReactRouterNavLink,
  type NavLinkProps as ReactRouterNavLinkProps,
} from 'react-router-dom';

import { NavLink, type NavLinkProps } from '@frontend/shared/design-system';

type Props = Omit<NavLinkProps, 'as'> & ReactRouterNavLinkProps;

export const RouterNavLink = (props: Props) => {
  return <NavLink {...props} as={ReactRouterNavLink} />;
};
