import { forwardRef } from 'react';
import {
  Link as ChakraLink,
  type LinkProps as ChakraLinkProps,
} from '@chakra-ui/react';

export type LinkProps = ChakraLinkProps & {
  noUnderline?: boolean;
  isInsideInfoHintBox?: boolean;
};

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ noUnderline, isInsideInfoHintBox, ...rest }: LinkProps, ref) => {
    return (
      <ChakraLink
        color={isInsideInfoHintBox ? 'goldenYellow.700' : 'goldenYellow.500'}
        _hover={{ textDecoration: noUnderline ? 'none' : 'underline' }}
        ref={ref}
        {...rest}
      />
    );
  },
);
