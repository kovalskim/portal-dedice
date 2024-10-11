import {
  NavLink as ReactRouterNavLink,
  type NavLinkProps as ReactRouterNavLinkProps,
} from 'react-router-dom';

import {
  PrimaryButton,
  PrimaryButtonProps,
} from '@frontend/components/buttons/PrimaryButton';

type Props = Omit<PrimaryButtonProps, 'as'> & ReactRouterNavLinkProps;

export const RouterNavButton = (props: Props) => {
  return <PrimaryButton {...props} as={ReactRouterNavLink} />;
};
