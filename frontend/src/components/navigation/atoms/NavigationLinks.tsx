import { MouseEventHandler } from 'react';

import { RouterNavLink } from '@frontend/components/navigation/atoms/RouterNavLink.tsx';
import { Routes } from '@frontend/routes.ts';

type NavigationLinksProps = {
  onClose?: MouseEventHandler<HTMLAnchorElement>;
};

export const NavigationLinks = ({ onClose }: NavigationLinksProps) => (
  <>
    <RouterNavLink to={Routes.home} onClick={onClose}>
      O portálu
    </RouterNavLink>
    <RouterNavLink to={Routes.educator} onClick={onClose}>
      Nachytřovadlo
    </RouterNavLink>
  </>
);
