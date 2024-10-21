"use client";

import { Cantarell } from "next/font/google";
import { createTheme } from "@mui/material/styles";

const cantarell = Cantarell({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

const theme = createTheme({
  palette: {
    primary: {
      main: "#333333",
    },
    secondary: {
      main: "#666666",
    },
    background: {
      default: "#ffffff",
    },
  },
  typography: {
    fontFamily: cantarell.style.fontFamily,
    h1: {
      fontSize: "3rem",
      fontWeight: 700,
    },
    h2: {
      fontSize: "2.5rem",
      fontWeight: 600,
    },
    h3: {
      fontSize: "2rem",
      fontWeight: 600,
    },
  },
});

export default theme;
