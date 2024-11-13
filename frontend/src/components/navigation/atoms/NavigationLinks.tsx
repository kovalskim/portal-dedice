import { MouseEventHandler } from 'react';

import { RouterNavLink } from '@frontend/components/navigation/atoms/RouterNavLink.tsx';
import { useAuth } from '@frontend/context/auth';
import { Routes } from '@frontend/routes.ts';

type NavigationLinksProps = {
  onClose?: MouseEventHandler<HTMLAnchorElement>;
};

export const NavigationLinks = ({ onClose }: NavigationLinksProps) => {
  const { user } = useAuth();

  return (
    <>
      <RouterNavLink to={Routes.home} onClick={onClose}>
        O portálu
      </RouterNavLink>
      <RouterNavLink to={Routes.educator} onClick={onClose}>
        Nachytřovadlo
      </RouterNavLink>
      {user !== null && (
        <RouterNavLink to={Routes.proceedings} onClick={onClose}>
          Moje řízení
        </RouterNavLink>
      )}
    </>
  );
};
