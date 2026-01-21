import { Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface NumberPickerProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
}

export function NumberPicker({
  value,
  onChange,
  min = 1,
  max = 99,
}: NumberPickerProps) {
  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1)
    }
  }

  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10)
    if (!isNaN(newValue) && newValue >= min && newValue <= max) {
      onChange(newValue)
    }
  }

  return (
    <div className="flex items-center justify-center gap-1">
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={handleDecrement}
        disabled={value <= min}
        className="h-12 w-12"
      >
        <Minus className="h-4 w-4" />
      </Button>
      <Input
        type="number"
        value={value}
        onChange={handleChange}
        min={min}
        max={max}
        className="h-12 w-16 text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={handleIncrement}
        disabled={value >= max}
        className="h-12 w-12"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  )
}
