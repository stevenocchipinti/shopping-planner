import * as React from "react"
import { Wifi, WifiOff } from "lucide-react"
import { useToast } from "@/contexts/toast-context"

// Hook to monitor online/offline status
export function useOnlineStatus() {
  const { addToast } = useToast()
  const [isOnline, setIsOnline] = React.useState(navigator.onLine)
  const initialRef = React.useRef(true)

  React.useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      if (!initialRef.current) {
        addToast({
          message: "You're back online",
          type: "success",
          icon: <Wifi className="h-4 w-4" />,
        })
      }
    }

    const handleOffline = () => {
      setIsOnline(false)
      addToast({
        message: "You're offline. Changes will sync when reconnected.",
        type: "warning",
        icon: <WifiOff className="h-4 w-4" />,
      })
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // Mark initial load as complete
    initialRef.current = false

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [addToast])

  return isOnline
}
