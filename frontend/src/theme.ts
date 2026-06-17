import { createTheme, Theme, ThemeOptions } from "@mui/material/styles";
import { ThemeMode } from "./types/context.types";

declare module "@mui/material/styles" {
  interface Theme {
    custom: {
      borderRadius: { small: number; medium: number; large: number };
      colors: {
        cream: string;
        surface: string;
        borderWarm: string;
        green: string;
        green700: string;
        gold: string;
        clay: string;
        ink: string;
        muted: string;
        whatsapp: string;
      };
      shadow: { soft: string; md: string };
    };
  }

  interface ThemeOptions {
    custom?: {
      borderRadius?: { small?: number; medium?: number; large?: number };
      colors?: Record<string, string>;
      shadow?: { soft?: string; md?: string };
    };
  }
}

const LIGHT_COLORS = {
  cream: "#FAF5EE",
  surface: "#FFFFFF",
  borderWarm: "#E9DFD1",
  green: "#2C4A3B",
  green700: "#22392E",
  gold: "#C2A14D",
  clay: "#B85C38",
  ink: "#211C16",
  muted: "#7A7064",
  whatsapp: "#25D366",
};

const DARK_COLORS = {
  cream: "#15120F",
  surface: "#211C16",
  borderWarm: "rgba(194, 161, 77, 0.24)",
  green: "#C2A14D",
  green700: "#A8842F",
  gold: "#C2A14D",
  clay: "#D9825F",
  ink: "#FAF5EE",
  muted: "#C7B9A5",
  whatsapp: "#25D366",
};

const LIGHT_SHADOW = {
  soft: "0 6px 22px rgba(33,28,22,.06)",
  md: "0 10px 30px rgba(33,28,22,.10)",
};

const DARK_SHADOW = {
  soft: "0 6px 22px rgba(0,0,0,.28)",
  md: "0 10px 30px rgba(0,0,0,.38)",
};

export function getTheme(mode: ThemeMode): Theme {
  const isDark = mode === "dark";
  const COLORS = isDark ? DARK_COLORS : LIGHT_COLORS;
  const SHADOW = isDark ? DARK_SHADOW : LIGHT_SHADOW;

  const themeOptions: ThemeOptions = {
    direction: "rtl",
    palette: {
      mode,
      primary: {
        main: COLORS.green,
        dark: COLORS.green700,
        contrastText: isDark ? "#15120F" : "#FFFFFF",
      },
      secondary: {
        main: COLORS.gold,
        contrastText: isDark ? "#15120F" : COLORS.ink,
      },
      background: {
        default: COLORS.cream,
        paper: COLORS.surface,
      },
      text: {
        primary: COLORS.ink,
        secondary: COLORS.muted,
      },
      divider: COLORS.borderWarm,
      success: {
        main: COLORS.whatsapp,
        contrastText: "#FFFFFF",
      },
      warning: {
        main: COLORS.clay,
      },
      error: {
        main: COLORS.clay,
      },
    },
    typography: {
      fontFamily: "'Tajawal', 'Segoe UI', sans-serif",
      h1: {
        fontFamily: "'El Messiri', 'Tajawal', sans-serif",
        fontWeight: 700,
        letterSpacing: 0,
      },
      h2: {
        fontFamily: "'El Messiri', 'Tajawal', sans-serif",
        fontWeight: 700,
        letterSpacing: 0,
      },
      h3: {
        fontFamily: "'El Messiri', 'Tajawal', sans-serif",
        fontWeight: 700,
      },
      h4: {
        fontFamily: "'El Messiri', 'Tajawal', sans-serif",
        fontWeight: 700,
      },
      h5: {
        fontFamily: "'El Messiri', 'Tajawal', sans-serif",
        fontWeight: 600,
      },
      h6: {
        fontFamily: "'El Messiri', 'Tajawal', sans-serif",
        fontWeight: 600,
      },
      button: {
        fontWeight: 700,
      },
      body1: {
        lineHeight: 1.85,
      },
      body2: {
        lineHeight: 1.8,
      },
    },
    shape: {
      borderRadius: 14,
    },
    components: {
      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },
        styleOverrides: {
          root: {
            borderRadius: 12,
            textTransform: "none",
            fontWeight: 700,
            paddingInline: 22,
            paddingBlock: 10,
            boxShadow: "none",
            transition: "all .28s cubic-bezier(.4,0,.2,1)",
          },
          containedPrimary: {
            backgroundColor: COLORS.green,
            color: isDark ? "#15120F" : "#FFFFFF",
            "&:hover": {
              backgroundColor: COLORS.green700,
              boxShadow: isDark
                ? "0 8px 20px rgba(194,161,77,.22)"
                : "0 8px 20px rgba(44,74,59,.22)",
              transform: "translateY(-1px)",
            },
          },
          containedSecondary: {
            backgroundColor: COLORS.gold,
            color: isDark ? "#15120F" : COLORS.ink,
            "&:hover": {
              backgroundColor: COLORS.green700,
            },
          },
          outlinedPrimary: {
            borderColor: COLORS.green,
            color: COLORS.green,
            "&:hover": {
              backgroundColor: isDark
                ? "rgba(194,161,77,.10)"
                : "rgba(44,74,59,.06)",
              borderColor: COLORS.green,
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: COLORS.surface,
            backgroundImage: "none",
            border: `1px solid ${COLORS.borderWarm}`,
            borderRadius: 16,
            boxShadow: SHADOW.soft,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
            backdropFilter: "blur(10px)",
            borderBottom: `1px solid ${COLORS.borderWarm}`,
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: COLORS.surface,
            backgroundImage: "none",
            borderInlineStart: `1px solid ${COLORS.borderWarm}`,
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            transition: "all .25s ease",
            "&:hover": {
              backgroundColor: isDark
                ? "rgba(194,161,77,.10)"
                : "rgba(44,74,59,.06)",
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontWeight: 600,
            borderRadius: 999,
          },
          colorPrimary: {
            backgroundColor: isDark
              ? "rgba(194,161,77,.18)"
              : "rgba(44,74,59,.10)",
            color: COLORS.green,
          },
          colorSecondary: {
            backgroundColor: isDark
              ? "rgba(194,161,77,.18)"
              : "rgba(194,161,77,.14)",
            color: COLORS.gold,
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            backgroundColor: COLORS.surface,
            borderRadius: 12,
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: COLORS.green,
            },
          },
        },
      },
      MuiInputBase: {
        styleOverrides: {
          root: {
            color: COLORS.ink,
          },
        },
      },
    },
    custom: {
      borderRadius: {
        small: 8,
        medium: 14,
        large: 28,
      },
      colors: COLORS,
      shadow: SHADOW,
    },
  };

  return createTheme(themeOptions);
}