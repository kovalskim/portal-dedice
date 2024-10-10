import { useAuth } from '@frontend/modules/auth';
import { route } from '@frontend/route';
import { Button, Stack } from '@frontend/shared/design-system';

import { RouterNavLink } from '../atoms';

export function TopNavigation() {
  const { user, signOut } = useAuth();
  return (
    <Stack bg="white" p="4" direction="row" spacing="0" alignItems="center">
      <RouterNavLink to={route.home()}>Home</RouterNavLink>
      {user === null ? (
        <>
          <RouterNavLink to={route.signIn()}>Sign In</RouterNavLink>
          <RouterNavLink to={route.signUp()}>Sign Up</RouterNavLink>
        </>
      ) : (
        <Button ml="2" onClick={() => signOut()}>
          Sign Out
        </Button>
      )}
    </Stack>
  );
}
