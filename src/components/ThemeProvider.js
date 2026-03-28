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
import { teal } from "@mui/material/colors"
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
      ...teal,
      main: isDark ? "#7dd6b6" : "#2d7560",
      light: isDark ? "#a5e8cf" : "#5ba88e",
      dark: isDark ? "#4ca284" : "#1f5848",
      contrastText: isDark ? "#062017" : "#f8faf6",
    },
    secondary: {
      main: isDark ? "#ffb087" : "#f08358",
      light: isDark ? "#ffc8ac" : "#ffb28d",
      dark: isDark ? "#f28a5c" : "#cb6039",
      contrastText: "#2a1309",
    },
    background: {
      default: isDark ? "#0f1614" : "#f6efe6",
      paper: isDark ? "rgba(23, 32, 29, 0.88)" : "rgba(255, 252, 247, 0.88)",
    },
    text: {
      primary: isDark ? "#f4efe8" : "#21322b",
      secondary: isDark ? "rgba(233, 225, 214, 0.72)" : "rgba(49, 69, 61, 0.68)",
    },
    divider: isDark ? "rgba(226, 216, 201, 0.1)" : "rgba(46, 71, 61, 0.12)",
  }

  const app = {
    border: isDark ? "rgba(226, 216, 201, 0.1)" : "rgba(61, 89, 77, 0.12)",
    chrome: isDark ? "rgba(20, 29, 26, 0.82)" : "rgba(255, 250, 244, 0.78)",
    shell: isDark
      ? "linear-gradient(180deg, rgba(22, 30, 27, 0.94), rgba(13, 20, 18, 0.98))"
      : "linear-gradient(180deg, rgba(255, 251, 246, 0.92), rgba(250, 244, 235, 0.96))",
    primaryGradient: isDark
      ? "linear-gradient(135deg, #8de0c1 0%, #4aa385 100%)"
      : "linear-gradient(135deg, #3c8f73 0%, #205444 100%)",
    accentGradient: isDark
      ? "linear-gradient(135deg, rgba(255, 176, 135, 0.26), rgba(125, 214, 182, 0.16))"
      : "linear-gradient(135deg, rgba(255, 191, 154, 0.5), rgba(124, 203, 172, 0.22))",
    chip: isDark
      ? "linear-gradient(135deg, rgba(255, 255, 255, 0.06), rgba(125, 214, 182, 0.16))"
      : "linear-gradient(135deg, rgba(255, 255, 255, 0.94), rgba(255, 238, 228, 0.88))",
    chipDone: isDark
      ? "linear-gradient(135deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.05))"
      : "linear-gradient(135deg, rgba(255, 255, 255, 0.7), rgba(236, 232, 225, 0.86))",
    floatShadow: isDark
      ? "0 24px 48px rgba(0, 0, 0, 0.36)"
      : "0 24px 48px rgba(120, 88, 50, 0.14)",
    softShadow: isDark
      ? "0 16px 40px rgba(0, 0, 0, 0.22)"
      : "0 16px 40px rgba(108, 80, 46, 0.12)",
    shellShadow: isDark
      ? "0 28px 60px rgba(0, 0, 0, 0.38)"
      : "0 28px 60px rgba(100, 74, 44, 0.14)",
  }

  return createTheme({
    palette,
    app,
    shape: {
      borderRadius: 24,
    },
    typography: {
      fontFamily: '"DM Sans", sans-serif',
      h1: {
        fontFamily: '"Fraunces", serif',
        fontWeight: 700,
      },
      h2: {
        fontFamily: '"Fraunces", serif',
        fontWeight: 700,
      },
      h3: {
        fontFamily: '"Fraunces", serif',
        fontWeight: 700,
      },
      h4: {
        fontFamily: '"Fraunces", serif',
        fontWeight: 700,
      },
      h5: {
        fontFamily: '"Fraunces", serif',
        fontWeight: 600,
      },
      h6: {
        fontFamily: '"Fraunces", serif',
        fontWeight: 600,
      },
      button: {
        fontWeight: 700,
        textTransform: "none",
        letterSpacing: "-0.01em",
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            background: isDark
              ? "radial-gradient(circle at top left, rgba(125, 214, 182, 0.14), transparent 28%), radial-gradient(circle at top right, rgba(255, 176, 135, 0.18), transparent 32%), linear-gradient(180deg, #121a17 0%, #0b1110 100%)"
              : "radial-gradient(circle at top left, rgba(255, 186, 145, 0.4), transparent 30%), radial-gradient(circle at top right, rgba(122, 201, 170, 0.28), transparent 28%), linear-gradient(180deg, #fbf5ee 0%, #f4ebdf 100%)",
            color: palette.text.primary,
          },
          "*::selection": {
            backgroundColor: alpha(palette.secondary.main, 0.28),
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
            backgroundColor: palette.background.paper,
            border: `1px solid ${app.border}`,
            backdropFilter: "blur(18px)",
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
            borderRadius: 18,
            paddingInline: 18,
            boxShadow: "none",
          },
          contained: {
            background: app.primaryGradient,
            color: palette.primary.contrastText,
            boxShadow: app.softShadow,
            "&:hover": {
              background: app.primaryGradient,
              boxShadow: app.softShadow,
            },
            "&.Mui-disabled": {
              color: alpha(palette.primary.contrastText, 0.65),
            },
          },
          outlined: {
            borderColor: app.border,
            backgroundColor: alpha(palette.background.paper, 0.42),
          },
        },
      },
      MuiFab: {
        styleOverrides: {
          root: {
            background: app.primaryGradient,
            color: palette.primary.contrastText,
            boxShadow: app.floatShadow,
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            borderRadius: 18,
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 28,
            backgroundColor: palette.background.paper,
            boxShadow: app.shellShadow,
            backgroundImage: "none",
          },
        },
      },
      MuiBackdrop: {
        styleOverrides: {
          root: {
            backdropFilter: "blur(14px)",
            backgroundColor: isDark
              ? "rgba(7, 12, 10, 0.48)"
              : "rgba(33, 24, 18, 0.18)",
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundImage: "none",
            backgroundColor: app.chrome,
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 18,
            backgroundColor: alpha(palette.background.paper, isDark ? 0.08 : 0.72),
            ".MuiOutlinedInput-notchedOutline": {
              borderColor: app.border,
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: alpha(palette.primary.main, 0.5),
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
            borderRadius: 18,
            minWidth: 88,
            color: palette.text.secondary,
          },
          label: {
            fontSize: 12,
            fontWeight: 700,
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
              backgroundColor: alpha(palette.primary.main, 0.72),
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
  padding: 6px;
  border-radius: 22px;
  background: ${({ theme }) => theme.app.accentGradient};
  border: 1px solid ${({ theme }) => theme.app.border};
`

const ToggleCard = styled.div`
  margin-top: auto;
  padding: 16px;
`

const ToggleLabel = styled.p`
  margin: 0 0 10px;
  color: ${({ theme }) => theme.palette.text.secondary};
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.06em;
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
