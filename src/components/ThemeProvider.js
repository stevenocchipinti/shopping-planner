import React, { useContext, createContext } from "react"
import styled, { ThemeProvider as ScThemeProvider } from "styled-components"

import {
  CssBaseline,
  ToggleButton,
  ToggleButtonGroup as MuiToggleButtonGroup,
  useMediaQuery,
} from "@mui/material"
import {
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

const ToggleButtonGroup = styled(MuiToggleButtonGroup)`
  margin: 16px auto;
`

const DarkModeToggle = () => {
  const { brightnessPreference, setBrightnessPreference } = useContext(
    DarkModeContext
  )

  return (
    <ToggleButtonGroup
      value={brightnessPreference}
      exclusive
      onChange={(_, newPref) => newPref && setBrightnessPreference(newPref)}
      aria-label="Brightness preference"
    >
      <ToggleButton value="light" aria-label="left aligned">
        <Brightness5 />
      </ToggleButton>
      <ToggleButton value="dark" aria-label="centered">
        <Brightness3 />
      </ToggleButton>
      <ToggleButton value="auto" aria-label="right aligned">
        <BrightnessAuto />
      </ToggleButton>
    </ToggleButtonGroup>
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
    return createTheme({
      palette: {
        mode: effectiveModes[brightnessPreference],
        primary: teal,
      },
    })
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
