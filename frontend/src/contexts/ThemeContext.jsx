// src/contexts/ThemeContext.jsx
import { createContext, useState, useEffect, useMemo } from "react";
import { ThemeProvider as MUIThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme } from "@mui/material/styles";

export const ThemeContext = createContext({
  mode: "light",
  toggleMode: () => {},
});

export function ThemeProvider({ children }) {
  // قراءة الوضع من localStorage أو استخدام الوضع الافتراضي
  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem("themeMode");
    return savedMode || "light";
  });

  // إنشاء الثيم بناءً على الوضع
  const theme = useMemo(
    () =>
      createTheme({
        direction: "rtl",
        palette: {
          mode,
          primary: {
            main: mode === "dark" ? "#5c6bc0" : "#1a237e",
            light: mode === "dark" ? "#8e99f3" : "#534bae",
            dark: mode === "dark" ? "#26418f" : "#000051",
            contrastText: "#ffffff",
          },
          secondary: {
            main: mode === "dark" ? "#29b6f6" : "#0277bd",
            light: mode === "dark" ? "#4fc3f7" : "#0288d1",
            dark: mode === "dark" ? "#0288d1" : "#01579b",
          },
          background: {
            default: mode === "dark" ? "#121212" : "#f9fafb",
            paper: mode === "dark" ? "#1e1e1e" : "#ffffff",
          },
          text: {
            primary: mode === "dark" ? "#ffffff" : "#212121",
            secondary: mode === "dark" ? "#b0b0b0" : "#757575",
          },
          divider: mode === "dark" ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.12)",
        },
        typography: {
          fontFamily: "'Cairo', sans-serif",
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                // إضافة مسافة بين الأيقونات والنصوص في الأزرار
                '& .MuiButton-startIcon': {
                  marginLeft: 8,
                  marginRight: -4,
                },
                '& .MuiButton-endIcon': {
                  marginRight: 8,
                  marginLeft: -4,
                },
              },
            },
          },
          MuiIconButton: {
            styleOverrides: {
              root: {
                // إضافة مسافة للأيقونات داخل IconButton عند وجود نص
                '& .MuiSvgIcon-root': {
                  margin: '0 2px',
                },
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                backgroundColor: mode === "dark" ? "#1e1e1e" : "#ffffff",
                backgroundImage: "none",
              },
            },
          },
          MuiAppBar: {
            styleOverrides: {
              root: {
                backgroundColor: mode === "dark" ? "#1e1e1e" : "#ffffff",
                color: mode === "dark" ? "#ffffff" : "#333",
                backgroundImage: "none",
              },
            },
          },
          MuiDrawer: {
            styleOverrides: {
              paper: {
                backgroundColor: mode === "dark" ? "#1e1e1e" : "#ffffff",
                backgroundImage: "none",
              },
            },
          },
        },
      }),
    [mode]
  );

  // حفظ الوضع في localStorage عند التغيير
  useEffect(() => {
    localStorage.setItem("themeMode", mode);
  }, [mode]);

  const toggleMode = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ mode, toggleMode }}>
      <MUIThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MUIThemeProvider>
    </ThemeContext.Provider>
  );
}

