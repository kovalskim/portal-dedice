import {
  NavLink as ReactRouterNavLink,
  type NavLinkProps as ReactRouterNavLinkProps,
} from 'react-router-dom';

import {
  PrimaryButton,
  PrimaryButtonProps,
} from '@frontend/shared/design-system/atoms/buttons/PrimaryButton.tsx';

type Props = Omit<PrimaryButtonProps, 'as'> & ReactRouterNavLinkProps;

export const RouterNavButton = (props: Props) => {
  return <PrimaryButton {...props} as={ReactRouterNavLink} />;
};
