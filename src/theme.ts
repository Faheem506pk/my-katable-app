import { createTheme, Theme } from '@mui/material';

export const lightTheme: Theme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#ffffff',
      paper: '#f5f5f5',
    },
    text: {
      primary: '#000000',
      secondary: '#4f4f4f',
    },
  },
  typography: {
    fontFamily: '"ui-sans-serif", -apple-system, BlinkMacSystemFont, "Segoe UI Variable Display", "Segoe UI", Helvetica, "Apple Color Emoji", sans-serif',
    },
});

export const darkTheme: Theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#191919',
      paper: '#1f1f1f',
    },
    text: {
      primary: '#ffffff',
      secondary: '#bdbdbd',
    },
  },
  typography: {
    fontFamily: '"ui-sans-serif", -apple-system, BlinkMacSystemFont, "Segoe UI Variable Display", "Segoe UI", Helvetica, "Apple Color Emoji", sans-serif',
    },
});
