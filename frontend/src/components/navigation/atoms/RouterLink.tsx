import { Link as ReactRouterLink } from 'react-router-dom';

import { forwardRef } from '@frontend/components/design-system';
import { Link, LinkProps } from '@frontend/components/links';

type Props = Omit<LinkProps, 'as'>;

export const RouterLink = forwardRef((props: Props, ref) => {
  return <Link as={ReactRouterLink} ref={ref} {...props} />;
});
