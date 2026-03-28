import React, { FC } from "react"
import styled from "styled-components"
import { FormControlLabel, Paper, Switch, Typography } from "@mui/material"

import useSetting from "../useSetting"
import AppBar from "../components/AppBar"

interface ToggleProps {
  name: string
  value: boolean
  set: (v: boolean | string) => void
  beta?: boolean
}

const Screen = styled.div`
  max-width: 720px;
  margin: 0 auto;
  padding: 0 16px 40px;
`

const Hero = styled(Paper)`
  padding: 20px;
  border-radius: 14px;
  background: ${({ theme }) => theme.app.accentGradient};
  margin-bottom: 12px;
`

const Label = styled(FormControlLabel)`
  && {
    color: ${({ theme }) => theme.palette.text.primary};
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0;
    width: 100%;
  }
`

const Card = styled(Paper)`
  padding: 16px 18px;
  border-radius: 14px;
  margin-bottom: 10px;
`

const Caption = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: ${({ theme }) => theme.palette.text.primary};
  font-weight: 600;
`

const BetaPill = styled.span`
  padding: 4px 8px;
  border-radius: 999px;
  background: ${({ theme }) => theme.palette.action.selected};
  color: ${({ theme }) => theme.palette.text.secondary};
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`

const Toggle: FC<ToggleProps> = ({ name, value, set, beta = false }) => (
  <Card>
    <Label
      value="start"
      control={
        <Switch
          name={name}
          checked={value}
          onChange={e => set(e.target.checked)}
        />
      }
      label={
        <Caption>
          {name}
          {beta && <BetaPill>Beta</BetaPill>}
        </Caption>
      }
      labelPlacement="start"
    />
  </Card>
)

const Settings: FC = () => {
  const [emoji, setEmoji] = useSetting("emojiSupport")
  const [placeholders, setPlaceholders] = useSetting("cutePlaceholders")

  const settings: ToggleProps[] = [
    { name: "Emoji support", value: emoji, set: setEmoji, beta: true },
    { name: "Cute placeholders", value: placeholders, set: setPlaceholders },
  ]

  return (
    <Screen>
      <AppBar title="Settings" />
      <Hero>
        <Typography variant="h4" component="h2" gutterBottom>
          Tune the experience.
        </Typography>
        <Typography color="text.secondary" variant="body1" component="p">
          Keep the interface light, playful, and optimized for the way you actually shop.
        </Typography>
      </Hero>
      {settings.map(setting => (
        <Toggle key={setting.name} {...setting} />
      ))}
    </Screen>
  )
}

export default Settings
