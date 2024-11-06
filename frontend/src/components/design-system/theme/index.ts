import { extendTheme } from '@chakra-ui/react';

export const theme = extendTheme({
  colors: {
    goldenYellow: {
      10: '#DCAB6B1A',
      50: '#FAF0DD',
      100: '#F5E3C2',
      200: '#EDD29A',
      300: '#E4C172',
      500: '#DCAB6B',
      600: '#9F7A48',
      700: '#7D5F37',
      800: '#5A4425',
      900: '#3A2D18',
    },
    lightGray: {
      500: '#CAC5C5',
    },
    cream: {
      500: '#FFF5E7',
    },
  },
  styles: {
    global: {
      '#root': {
        display: 'flex',
        minHeight: '100vh',
      },
      '.pac-container': {
        // google autocomplete dropdown class
        zIndex: '10000',
      },
    },
  },
  components: {
    Input: {
      defaultProps: {
        focusBorderColor: 'goldenYellow.500',
      },
    },
  },
});
