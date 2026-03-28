import React, { createContext, useContext } from "react"
import styled, { ThemeProvider as ScThemeProvider } from "styled-components"

import {
  CssBaseline,
  ToggleButton,
  ToggleButtonGroup as MuiToggleButtonGroup,
  useMediaQuery,
} from "@mui/material"
import {
  alpha,
  ThemeProvider as MuiThemeProvider,
  createTheme,
} from "@mui/material/styles"
import {
  Brightness3,
  Brightness5,
  BrightnessAuto,
} from "@mui/icons-material"

import useLocalStorage from "../useLocalStorage"

const DarkModeContext = createContext(null)

const buildTheme = mode => {
  const isDark = mode === "dark"

  const palette = {
    mode,
    primary: {
      main: isDark ? "#8fb89a" : "#5a8a68",
      light: isDark ? "#aed0b6" : "#7ba587",
      dark: isDark ? "#6d9b79" : "#3d6a4c",
      contrastText: isDark ? "#0d1a10" : "#fbfcfb",
    },
    secondary: {
      main: isDark ? "#c4a882" : "#a38560",
      light: isDark ? "#d4be9f" : "#bfa180",
      dark: isDark ? "#aa8e68" : "#876b46",
      contrastText: "#1a1408",
    },
    background: {
      default: isDark ? "#171c19" : "#f7f3ed",
      paper: isDark ? "#1e241f" : "#fffcf7",
    },
    text: {
      primary: isDark ? "#e6e0d8" : "#2d3630",
      secondary: isDark ? "rgba(230, 224, 216, 0.50)" : "rgba(45, 54, 48, 0.50)",
    },
    divider: isDark ? "rgba(230, 224, 216, 0.08)" : "rgba(45, 54, 48, 0.08)",
  }

  const app = {
    border: isDark ? "rgba(230, 224, 216, 0.06)" : "rgba(45, 54, 48, 0.06)",
    chrome: isDark ? "#1e241f" : "#fffcf7",
    shell: isDark
      ? "rgba(30, 36, 31, 0.95)"
      : "rgba(255, 252, 247, 0.95)",
    primaryGradient: isDark
      ? "linear-gradient(135deg, #8fb89a 0%, #6d9b79 100%)"
      : "linear-gradient(135deg, #6d9b79 0%, #4a7e58 100%)",
    accentGradient: isDark
      ? "rgba(143, 184, 154, 0.06)"
      : "rgba(90, 138, 104, 0.04)",
    chip: isDark
      ? "rgba(230, 224, 216, 0.04)"
      : "rgba(45, 54, 48, 0.025)",
    chipDone: isDark
      ? "rgba(230, 224, 216, 0.015)"
      : "rgba(45, 54, 48, 0.012)",
    floatShadow: isDark
      ? "0 8px 32px rgba(0, 0, 0, 0.25)"
      : "0 8px 32px rgba(45, 54, 48, 0.08)",
    softShadow: isDark
      ? "0 2px 8px rgba(0, 0, 0, 0.15)"
      : "0 2px 8px rgba(45, 54, 48, 0.04)",
    shellShadow: isDark
      ? "0 4px 16px rgba(0, 0, 0, 0.2)"
      : "0 4px 16px rgba(45, 54, 48, 0.06)",
  }

  return createTheme({
    palette,
    app,
    shape: {
      borderRadius: 16,
    },
    typography: {
      fontFamily: '"Outfit", sans-serif',
      h1: {
        fontFamily: '"Cormorant Garamond", serif',
        fontWeight: 600,
        letterSpacing: "-0.02em",
      },
      h2: {
        fontFamily: '"Cormorant Garamond", serif',
        fontWeight: 600,
        letterSpacing: "-0.02em",
      },
      h3: {
        fontFamily: '"Cormorant Garamond", serif',
        fontWeight: 600,
        letterSpacing: "-0.01em",
      },
      h4: {
        fontFamily: '"Cormorant Garamond", serif',
        fontWeight: 600,
        letterSpacing: "-0.01em",
      },
      h5: {
        fontFamily: '"Cormorant Garamond", serif',
        fontWeight: 600,
        fontSize: "1.25rem",
        letterSpacing: 0,
      },
      h6: {
        fontFamily: '"Cormorant Garamond", serif',
        fontWeight: 600,
      },
      button: {
        fontWeight: 600,
        textTransform: "none",
        letterSpacing: "0",
        fontSize: "0.875rem",
      },
      body1: {
        fontWeight: 400,
        letterSpacing: "-0.005em",
      },
      body2: {
        fontWeight: 400,
        letterSpacing: "-0.005em",
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: palette.background.default,
            color: palette.text.primary,
          },
          "*::selection": {
            backgroundColor: alpha(palette.primary.main, 0.18),
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
            backgroundColor: palette.background.paper,
            border: `1px solid ${palette.divider}`,
            backdropFilter: "none",
            boxShadow: app.softShadow,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
            boxShadow: "none",
            color: palette.text.primary,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            paddingInline: 18,
            boxShadow: "none",
          },
          contained: {
            background: app.primaryGradient,
            color: palette.primary.contrastText,
            boxShadow: "none",
            "&:hover": {
              background: app.primaryGradient,
              boxShadow: "none",
              filter: "brightness(1.05)",
            },
            "&.Mui-disabled": {
              color: alpha(palette.primary.contrastText, 0.65),
            },
          },
          outlined: {
            borderColor: palette.divider,
          },
        },
      },
      MuiFab: {
        styleOverrides: {
          root: {
            background: app.primaryGradient,
            color: palette.primary.contrastText,
            boxShadow: app.floatShadow,
            "&:hover": {
              filter: "brightness(1.05)",
            },
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 20,
            backgroundColor: palette.background.paper,
            boxShadow: isDark
              ? "0 24px 64px rgba(0, 0, 0, 0.4)"
              : "0 24px 64px rgba(45, 54, 48, 0.1)",
            backgroundImage: "none",
            border: `1px solid ${palette.divider}`,
          },
        },
      },
      MuiBackdrop: {
        styleOverrides: {
          root: {
            backdropFilter: "blur(8px)",
            backgroundColor: isDark
              ? "rgba(0, 0, 0, 0.4)"
              : "rgba(45, 54, 48, 0.12)",
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundImage: "none",
            backgroundColor: palette.background.paper,
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            backgroundColor: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.015)",
            ".MuiOutlinedInput-notchedOutline": {
              borderColor: palette.divider,
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: alpha(palette.primary.main, 0.35),
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: palette.primary.main,
              borderWidth: 1,
            },
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            color: palette.text.secondary,
            transform: "translate(14px, 15px) scale(1)",
            "&.MuiInputLabel-shrink": {
              transform: "translate(14px, -9px) scale(0.75)",
            },
          },
        },
      },
      MuiBottomNavigationAction: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            minWidth: 80,
            color: palette.text.secondary,
          },
          label: {
            fontSize: 11,
            fontWeight: 600,
          },
        },
      },
      MuiSwitch: {
        styleOverrides: {
          switchBase: {
            "&.Mui-checked": {
              color: palette.primary.main,
            },
            "&.Mui-checked + .MuiSwitch-track": {
              backgroundColor: alpha(palette.primary.main, 0.5),
            },
          },
          track: {
            borderRadius: 999,
          },
        },
      },
    },
  })
}

const ToggleButtonGroup = styled(MuiToggleButtonGroup)`
  width: 100%;
  padding: 4px;
  border-radius: 14px;
  background: ${({ theme }) => theme.app.accentGradient};
  border: 1px solid ${({ theme }) => theme.palette.divider};
`

const ToggleCard = styled.div`
  margin-top: auto;
  padding: 16px;
`

const ToggleLabel = styled.p`
  margin: 0 0 10px;
  color: ${({ theme }) => theme.palette.text.secondary};
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
`

const DarkModeToggle = () => {
  const { brightnessPreference, setBrightnessPreference } = useContext(
    DarkModeContext
  )

  return (
    <ToggleCard>
      <ToggleLabel>Appearance</ToggleLabel>
      <ToggleButtonGroup
        value={brightnessPreference}
        exclusive
        onChange={(_, newPref) => newPref && setBrightnessPreference(newPref)}
        aria-label="Brightness preference"
      >
        <ToggleButton value="light" aria-label="Light mode" sx={{ flex: 1 }}>
          <Brightness5 />
        </ToggleButton>
        <ToggleButton value="dark" aria-label="Dark mode" sx={{ flex: 1 }}>
          <Brightness3 />
        </ToggleButton>
        <ToggleButton value="auto" aria-label="Automatic mode" sx={{ flex: 1 }}>
          <BrightnessAuto />
        </ToggleButton>
      </ToggleButtonGroup>
    </ToggleCard>
  )
}

const AppThemeProvider = ({ children }) => {
  const [brightnessPreference, setBrightnessPreference] = useLocalStorage(
    "brightnessPreference",
    "auto"
  )
  const autoDarkMode = useMediaQuery("(prefers-color-scheme: dark)")

  const theme = React.useMemo(() => {
    const effectiveModes = {
      light: "light",
      dark: "dark",
      auto: autoDarkMode ? "dark" : "light",
    }
    return buildTheme(effectiveModes[brightnessPreference])
  }, [autoDarkMode, brightnessPreference])

  return (
    <DarkModeContext.Provider
      value={{ brightnessPreference, setBrightnessPreference }}
    >
      <ScThemeProvider theme={theme}>
        <MuiThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </MuiThemeProvider>
      </ScThemeProvider>
    </DarkModeContext.Provider>
  )
}

const ThemeProvider = ({ children }) => <AppThemeProvider>{children}</AppThemeProvider>

export { ThemeProvider, DarkModeToggle }
