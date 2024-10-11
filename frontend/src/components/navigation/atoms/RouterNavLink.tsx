import {
  NavLink as ReactRouterNavLink,
  type NavLinkProps as ReactRouterNavLinkProps,
} from 'react-router-dom';

import { NavLink, NavLinkProps } from '@frontend/components/links';

type Props = Omit<NavLinkProps, 'as'> & ReactRouterNavLinkProps;

export const RouterNavLink = (props: Props) => {
  return <NavLink {...props} as={ReactRouterNavLink} />;
};
