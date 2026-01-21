import * as React from "react"
import { X, Wifi, WifiOff } from "lucide-react"
import { cn } from "@/lib/utils"

interface Toast {
  id: string
  message: string
  type: "info" | "success" | "error" | "warning"
  icon?: React.ReactNode
}

interface ToastContextValue {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, "id">) => void
  removeToast: (id: string) => void
}

const ToastContext = React.createContext<ToastContextValue | null>(null)

export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([])

  const addToast = React.useCallback((toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).slice(2)
    setToasts(prev => [...prev, { ...toast, id }])

    // Auto-remove after 4 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 4000)
  }, [])

  const removeToast = React.useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  )
}

function ToastContainer({
  toasts,
  removeToast,
}: {
  toasts: Toast[]
  removeToast: (id: string) => void
}) {
  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg pointer-events-auto",
            "animate-in slide-in-from-bottom-2 fade-in",
            toast.type === "info" && "bg-background border",
            toast.type === "success" && "bg-green-600 text-white",
            toast.type === "error" &&
              "bg-destructive text-destructive-foreground",
            toast.type === "warning" && "bg-yellow-500 text-white"
          )}
        >
          {toast.icon && <span className="flex-shrink-0">{toast.icon}</span>}
          <span className="flex-1 text-sm font-medium">{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )
}

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
