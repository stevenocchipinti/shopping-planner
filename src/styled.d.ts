import "styled-components"
import { Theme } from "@mui/material/styles"

interface AppCustomProperties {
  border: string
  chrome: string
  shell: string
  primaryGradient: string
  accentGradient: string
  chip: string
  chipDone: string
  floatShadow: string
  softShadow: string
  shellShadow: string
}

declare module "@mui/material/styles" {
  interface Theme {
    app: AppCustomProperties
  }
  interface ThemeOptions {
    app?: AppCustomProperties
  }
}

declare module "styled-components" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface DefaultTheme extends Theme {
    app: AppCustomProperties
  }
}
