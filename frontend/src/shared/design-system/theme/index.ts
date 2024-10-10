import { extendTheme } from '@chakra-ui/react';

export const theme = extendTheme({
  colors: {
    goldenYellow: {
      50: "#FAF0DD",
      100: "#F5E3C2",
      200: "#EDD29A",
      300: "#E4C172",
      400: "#DCAB6B", //base color we chose to use
      500: "#C2975D",
      600: "#9F7A48",
      700: "#7D5F37",
      800: "#5A4425",
      900: "#3A2D18",
    },
    lightGray: {
      400: "#CAC5C5",
    },
    cream: {
      500: "#FFF5E7",
    }
  },
  styles: {
    global: {},
  },
  components: {},
});
