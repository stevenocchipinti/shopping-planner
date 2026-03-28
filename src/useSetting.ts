import useLocalStorage from "./useLocalStorage"

export const defaultToggles: Record<string, boolean> = {
  emojiSupport: true,
  cutePlaceholders: true,
}

type RawSetting = "auto" | "on" | "off"

const useSetting = (
  key: string
): [boolean, (value: string | boolean) => void, string] => {
  const [rawSetting, setSetting] = useLocalStorage<string>(key, "auto")
  const effectiveSetting: boolean =
    {
      auto: defaultToggles[key] || false,
      on: true,
      off: false,
    }[rawSetting] ?? (rawSetting as unknown as boolean)

  const setValue = (value: string | boolean) => {
    if (typeof value === "boolean") {
      setSetting(value ? "on" : "off")
    } else {
      setSetting(value)
    }
  }

  return [effectiveSetting, setValue, rawSetting]
}

export default useSetting
