// client/src/theme.js
import { createTheme } from '@mui/material/styles';

export default createTheme({
  palette: {
    primary: {
      main: '#2A3F54',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#1ABB9C',
    },
    error: {
      main: '#E74C3C',
    },
    background: {
      default: '#F5F6FA',
    },
  },
  typography: {
    fontFamily: 'Inter, Arial, sans-serif',
    h4: {
      fontWeight: 600,
      fontSize: '1.75rem',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          padding: '8px 24px',
        },
      },
    },
  },
});