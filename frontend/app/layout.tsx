"use client";

import * as React from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import theme from "./theme";
import { SessionProvider } from "next-auth/react";
import AppHeader from "./AppHeader";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <AppRouterCacheProvider>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  minHeight: "100vh",
                }}
              >
                <AppHeader />
                <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
                  {children}
                </Container>
                <Box
                  component="footer"
                  sx={{
                    py: 3,
                    px: 2,
                    mt: "auto",
                    backgroundColor: "background.paper",
                    borderTop: 1,
                    borderColor: "divider",
                  }}
                >
                  <Container maxWidth="lg">
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      align="center"
                    >
                      &copy; {new Date().getFullYear()} DuBlog. All rights
                      reserved.
                    </Typography>
                  </Container>
                </Box>
              </Box>
            </ThemeProvider>
          </AppRouterCacheProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
