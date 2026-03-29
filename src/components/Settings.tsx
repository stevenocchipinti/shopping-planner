import React, { FC } from "react"

import useSetting from "../useSetting"
import AppBar from "../components/AppBar"
import { Switch } from "./ui"
import {
  betaPill,
  heroCard,
  heroCopy,
  heroTitle,
  pageShell,
  settingsCaption,
  settingsCard,
  settingsRow,
} from "./app-shell.css"

interface ToggleProps {
  name: string
  value: boolean
  set: (v: boolean | string) => void
  beta?: boolean
}

const Toggle: FC<ToggleProps> = ({ name, value, set, beta = false }) => (
  <div className={settingsCard}>
    <div className={settingsRow}>
      <span className={settingsCaption}>
        {name}
        {beta && <span className={betaPill}>Beta</span>}
      </span>
      <Switch
        name={name}
        checked={value}
        onChange={event => set(event.target.checked)}
        aria-label={name}
      />
    </div>
  </div>
)

const Settings: FC = () => {
  const [emoji, setEmoji] = useSetting("emojiSupport")
  const [placeholders, setPlaceholders] = useSetting("cutePlaceholders")

  const settings: ToggleProps[] = [
    { name: "Emoji support", value: emoji, set: setEmoji, beta: true },
    { name: "Cute placeholders", value: placeholders, set: setPlaceholders },
  ]

  return (
    <div className={pageShell}>
      <AppBar title="Settings" />
      <div className={heroCard}>
        <h2 className={heroTitle}>Tune the experience.</h2>
        <p className={heroCopy}>
          Keep the interface light, playful, and optimized for the way you
          actually shop.
        </p>
      </div>
      {settings.map(setting => (
        <Toggle key={setting.name} {...setting} />
      ))}
    </div>
  )
}

export default Settings
