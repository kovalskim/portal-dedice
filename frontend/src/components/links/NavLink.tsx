import {
  Link as ChakraLink,
  type LinkProps as ChakraLinkProps,
} from '@chakra-ui/react';

export type NavLinkProps = ChakraLinkProps;

export const NavLink = (props: NavLinkProps) => {
  return (
    <ChakraLink
      fontSize="md"
      px="4"
      py="3"
      display="flex"
      alignItems="center"
      _hover={{
        color: 'goldenYellow.600',
        textDecoration: 'underline',
        textUnderlineOffset: 10,
      }}
      _activeLink={{
        color: 'goldenYellow.600',
        fontWeight: 'bold',
        textDecoration: 'underline',
        textUnderlineOffset: 10,
      }}
      {...props}
    />
  );
};
