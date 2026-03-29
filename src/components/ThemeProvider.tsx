import React, { FC, ReactNode, createContext, useContext, useEffect, useMemo } from "react"
import { Monitor, Moon, SunMedium } from "lucide-react"

import useLocalStorage from "../useLocalStorage"
import { ThemeMode, themeValues } from "../theme.css"
import { toggleButton, toggleCard, toggleGroup, toggleLabel } from "./theme-provider.css"

type BrightnessPreference = "light" | "dark" | "auto"

interface DarkModeContextType {
  mode: ThemeMode
  brightnessPreference: BrightnessPreference
  setBrightnessPreference: (value: BrightnessPreference) => void
}

const DarkModeContext = createContext<DarkModeContextType | null>(null)

const useSystemDarkMode = () => {
  const getMatches = () =>
    typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches

  const [matches, setMatches] = React.useState(getMatches)

  useEffect(() => {
    if (typeof window === "undefined") return

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = () => setMatches(mediaQuery.matches)

    handleChange()
    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  return matches
}

const resolveMode = (
  brightnessPreference: BrightnessPreference,
  prefersDarkMode: boolean
): ThemeMode => {
  if (brightnessPreference === "light") return "light"
  if (brightnessPreference === "dark") return "dark"
  return prefersDarkMode ? "dark" : "light"
}

interface AppThemeProviderProps {
  children: ReactNode
}

const AppThemeProvider: FC<AppThemeProviderProps> = ({ children }) => {
  const [brightnessPreference, setBrightnessPreference] =
    useLocalStorage<BrightnessPreference>("brightnessPreference", "auto")
  const prefersDarkMode = useSystemDarkMode()

  const mode = useMemo(
    () => resolveMode(brightnessPreference, prefersDarkMode),
    [brightnessPreference, prefersDarkMode]
  )

  useEffect(() => {
    document.documentElement.dataset.theme = mode === "dark" ? "dark" : "light"
    document.documentElement.style.colorScheme = mode

    const themeColor = document.querySelector('meta[name="theme-color"]')
    if (themeColor) {
      themeColor.setAttribute("content", themeValues[mode].color.bg)
    }
  }, [mode])

  return (
    <DarkModeContext.Provider
      value={{ mode, brightnessPreference, setBrightnessPreference }}
    >
      {children}
    </DarkModeContext.Provider>
  )
}

const ThemeProvider: FC<AppThemeProviderProps> = ({ children }) => (
  <AppThemeProvider>{children}</AppThemeProvider>
)

const useAppTheme = () => {
  const context = useContext(DarkModeContext)
  if (!context) {
    throw new Error("useAppTheme must be used within ThemeProvider")
  }
  return {
    ...context,
    colors: themeValues[context.mode],
  }
}

const DarkModeToggle: FC = () => {
  const { brightnessPreference, setBrightnessPreference } = useAppTheme()

  const options: Array<{ value: BrightnessPreference; label: string; icon: ReactNode }> = [
    { value: "light", label: "Light mode", icon: <SunMedium size={16} /> },
    { value: "dark", label: "Dark mode", icon: <Moon size={16} /> },
    { value: "auto", label: "Automatic mode", icon: <Monitor size={16} /> },
  ]

  return (
    <div className={toggleCard}>
      <p className={toggleLabel}>Appearance</p>
      <div className={toggleGroup} role="tablist" aria-label="Brightness preference">
        {options.map(option => (
          <button
            key={option.value}
            className={toggleButton}
            data-selected={brightnessPreference === option.value}
            type="button"
            onClick={() => setBrightnessPreference(option.value)}
            aria-label={option.label}
          >
            {option.icon}
          </button>
        ))}
      </div>
    </div>
  )
}

export { ThemeProvider, DarkModeToggle, useAppTheme }
