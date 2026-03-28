import React, { useState, useEffect, ReactNode } from "react"
import { createRoot } from "react-dom/client"
import { createGlobalStyle } from "styled-components"
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useParams,
} from "react-router-dom"
import { Snackbar } from "@mui/material"

import { AppProvider } from "./components/Backend"
import App from "./components/App"
import Home from "./components/Home"
import Settings from "./components/Settings"
import { ThemeProvider } from "./components/ThemeProvider"
import "./firebase"

interface NotificationState {
  message: string
  visible: boolean
}

const GlobalStyle = createGlobalStyle`
  :root {
    color-scheme: ${({ theme }) => theme.palette.mode};
  }

  body {
    margin: 0;
    padding: 0;
    background-color: ${({ theme }) => theme.palette.background.default};
    color: ${({ theme }) => theme.palette.text.primary};
    min-height: 100dvh;
    background-attachment: fixed;
  }

  #root {
    min-height: 100dvh;
  }

  * {
    font-family: "Outfit", sans-serif;
    box-sizing: border-box;
  }

  a {
    color: inherit;
  }
`

const ListRoute = () => {
  const { listId } = useParams()

  return (
    <AppProvider listId={listId!}>
      <App />
    </AppProvider>
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

  return (
    <ThemeProvider>
      <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <>
          <GlobalStyle />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/list/:listId/*" element={<ListRoute />} />
          </Routes>
        </>
      </Router>

      <Snackbar
        open={notification.visible}
        message={notification.message}
        autoHideDuration={3000}
        onClose={() => setNotification({ message: "", visible: false })}
      />
    </ThemeProvider>
  )
}

createRoot(document.getElementById("root")!).render(<Root />)
