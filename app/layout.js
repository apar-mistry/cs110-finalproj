import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

// Create a theme instance
// const theme = createTheme({
//   palette: {
//     mode: 'dark',
//   },
// });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Add any additional head elements */}
      </head>
      <body>
        <AppRouterCacheProvider>
            {children}
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
