import React, { useEffect, useState } from "react"
import { createRoot } from "react-dom/client"
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useParams,
} from "react-router-dom"
import { Toaster, toast } from "sonner"

import { AppProvider } from "./components/Backend"
import App from "./components/App"
import Home from "./components/Home"
import Settings from "./components/Settings"
import { ThemeProvider, useAppTheme } from "./components/ThemeProvider"
import { appRoot } from "./styles/global.css"
import "./firebase"
import "./theme.css"
import "./styles/global.css"

interface NotificationState {
  message: string
  visible: boolean
}

const ListRoute = () => {
  const { listId } = useParams()

  return (
    <AppProvider listId={listId!}>
      <App />
    </AppProvider>
  )
}

const AppToaster = () => {
  const { mode } = useAppTheme()

  return (
    <Toaster
      position="top-center"
      richColors
      theme={mode}
      toastOptions={{
        duration: 3000,
      }}
    />
  )
}

const Root = () => {
  const [notification, setNotification] = useState<NotificationState>({
    message: "",
    visible: false,
  })

  useEffect(() => {
    const handleOnline = () => {
      setNotification({ message: "You are now online!", visible: true })
    }

    const handleOffline = () => {
      setNotification({ message: "You have been disconnected", visible: true })
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  useEffect(() => {
    if (!notification.visible || !notification.message) return
    toast(notification.message)
    setNotification({ message: "", visible: false })
  }, [notification])

  return (
    <ThemeProvider>
      <div className={appRoot}>
        <Router
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/list/:listId/*" element={<ListRoute />} />
          </Routes>
        </Router>
        <AppToaster />
      </div>
    </ThemeProvider>
  )
}

createRoot(document.getElementById("root")!).render(<Root />)
