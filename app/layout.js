"use client"
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import BokehBackground from './components/BokehBackground';
// Create a theme instance
const theme = createTheme({
  palette: {
    mode: 'dark',
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(10px)',
          background: 'rgba(224, 225, 221, 0.3)',
          borderRadius: '15px',
          padding: '2rem',
          margin: '1rem',
        },
      },
    },
  }
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Add any additional head elements */}
      </head>
      <body>
        <AppRouterCacheProvider>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <BokehBackground />
            {children}
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
