import { forwardRef } from 'react';
import {
  Link as ChakraLink,
  type LinkProps as ChakraLinkProps,
} from '@chakra-ui/react';

export type LinkProps = ChakraLinkProps & {
  noUnderline?: boolean;
};

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ noUnderline, ...rest }: LinkProps, ref) => {
    return (
      <ChakraLink
        color="green.600"
        _hover={{ textDecoration: noUnderline ? 'none' : 'underline' }}
        ref={ref}
        {...rest}
      />
    );
  },
);
