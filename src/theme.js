import { createTheme } from '@mui/material/styles';

const commonSettings = {
  typography: {
    fontFamily: 'Inter, sans-serif',
  },
};

export const lightTheme = createTheme({
  ...commonSettings,
  palette: {
    mode: 'light',
    primary: {
      main: '#1294d5ff', // Unser Akzent
    },
    background: {
      default: '#f4f7f9',
      paper: '#ffffff',
    },
  },
});

export const darkTheme = createTheme({
  ...commonSettings,
  palette: {
    mode: 'dark',
    primary: {
      main: '#0c608bff', // Unser dunkler Akzent
    },
    background: {
      default: '#12181f',
      paper: '#1c242c',
    },
  },
});
