"use client";
import { createTheme } from "@mui/material/styles";
import { Work_Sans, Bebas_Neue } from "next/font/google";

const bodyFont = "Work Sans, sans-serif";
const headerFont = "Bebas Neue, sans-serif";

const bebas = Bebas_Neue({ subsets: ["latin"], weight: ["400"] });
const workSans = Work_Sans({ subsets: ["latin"], weight: ["400"] });

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#fc0349",
    },
  },

  typography: {
    fontFamily: bodyFont,
    h1: {
      fontFamily: headerFont,
      fontWeight: 400,
      fontSize: "2.5rem",
      "@media (min-width:600px)": { fontSize: "3.75rem" },
      "@media (min-width:900px)": { fontSize: "5rem" },
      "@media (min-width:1200px)": { fontSize: "6.25rem" },
    },
    h2: {
      fontFamily: headerFont,
      fontWeight: 400,
      fontSize: "1.25rem",
      "@media (min-width:600px)": { fontSize: "1.75rem" },
      "@media (min-width:900px)": { fontSize: "2.25rem" },
      "@media (min-width:1200px)": { fontSize: "3rem" },
    },
    h3: {
      fontFamily: headerFont,
      fontWeight: 400,
      fontSize: "1rem",
      "@media (min-width:600px)": { fontSize: "1.25rem" },
      "@media (min-width:900px)": { fontSize: "1.5rem" },
      "@media (min-width:1200px)": { fontSize: "1.75rem" },
    },
    button: {
      fontFamily: bodyFont,
      textTransform: "none",
      fontWeight: 600,
    },
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          padding: "8px 32px",
          backgroundColor: "#a60000",
          color: "white",
          borderRadius: 8,
          "&:hover": {
            backgroundColor: "#fc0349",
            color: "black",
          },
          "&:disabled": {
            opacity: 0.45,
            color: "white",
          },
        },
      },
    },

    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiInputLabel-root": {
            color: "#fff",
            fontFamily: bodyFont, // label font
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "#a60000",
          },
          "& .MuiOutlinedInput-root": {
            backgroundColor: "#222",
            color: "#fff",
            fontFamily: bodyFont, // input font
          },
          "& .MuiOutlinedInput-root.Mui-focused": {
            borderColor: "#fc0349",
          },
        },
      },
    },

    MuiAutocomplete: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            backgroundColor: "#222",
            color: "#fff",
            fontFamily: bodyFont,
          },
          "& .MuiAutocomplete-input": {
            fontFamily: bodyFont,
          },
          "& .MuiAutocomplete-clearIndicator": {
            color: "#fff",
            "&:hover": { color: "#fc0349" },
          },
          "& .MuiAutocomplete-popupIndicator": {
            color: "#fff",
            "&:hover": { color: "#fc0349" },
          },
        },
      },
      defaultProps: {
        slotProps: {
          popper: {
            sx: {
              "& .MuiAutocomplete-listbox": {
                backgroundColor: "#222",
                color: "#fff",
                fontFamily: bodyFont,
              },
              "& .MuiAutocomplete-option:hover": {
                backgroundColor: "#555",
                color: "#fff",
              },
              "& .MuiAutocomplete-option.Mui-selected": {
                backgroundColor: "#fc0349",
                color: "#fff",
              },
            },
          },
        },
      },
    },
  },
});

export default theme;
