// src/theme.js
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  direction: "rtl",
  palette: {
    background: { default: "#f9fafb" },
    primary: { 
      main: "#1a237e",
      light: "#534bae",
      dark: "#000051",
      contrastText: "#ffffff",
    },
    // بقية التعريفات...
  },
  typography: {
    fontFamily: "'Cairo', 'Segoe UI', 'Tahoma', 'Arial', sans-serif",
  },
});

export default theme;
