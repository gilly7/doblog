"use client";

import * as React from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Link from "next/link";
import theme from "./theme";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
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
              <AppBar position="static" color="primary" elevation={0}>
                <Toolbar>
                  <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    <Link
                      href="/"
                      passHref
                      style={{ color: "inherit", textDecoration: "none" }}
                    >
                      DuBlog
                    </Link>
                  </Typography>
                  <Button color="inherit" component={Link} href="/login">
                    Login
                  </Button>
                  <Button color="inherit" component={Link} href="/register">
                    Register
                  </Button>
                </Toolbar>
              </AppBar>
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
      </body>
    </html>
  );
}
