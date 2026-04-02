import React from "react"

import { dayPicker, dayPickerButton } from "../dialogs.css"

interface DayPickerProps {
  days: string[]
  value: string | null
  onChange: (value: string) => void
}

const DayPicker = ({ days, value, onChange }: DayPickerProps) => (
  <div className={dayPicker} role="tablist" aria-label="Day">
    {days.map(day => (
      <button
        key={day}
        className={dayPickerButton}
        data-selected={(value || days[0]) === day}
        type="button"
        onClick={() => onChange(day)}
      >
        {day[0]}
      </button>
    ))}
  </div>
)

export default DayPicker
