import {
  Link as ChakraLink,
  type LinkProps as ChakraLinkProps,
} from '@chakra-ui/react';

export type NavLinkProps = ChakraLinkProps;

export const NavLink = (props: NavLinkProps) => {
  return (
    <ChakraLink
      fontSize="sm"
      px="4"
      py="3"
      display="flex"
      alignItems="center"
      _hover={{
        bg: 'blackAlpha.400',
      }}
      _activeLink={{
        bg: 'blackAlpha.300',
        _hover: {
          bg: 'blackAlpha.400',
        },
      }}
      {...props}
    />
  );
};
