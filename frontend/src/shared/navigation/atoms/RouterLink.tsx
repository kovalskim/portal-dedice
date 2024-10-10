import { Link as ReactRouterLink } from 'react-router-dom';

import {
  forwardRef,
  Link,
  type LinkProps,
} from '@frontend/shared/design-system';

type Props = Omit<LinkProps, 'as'>;

export const RouterLink = forwardRef((props: Props, ref) => {
  return <Link as={ReactRouterLink} ref={ref} {...props} />;
});
