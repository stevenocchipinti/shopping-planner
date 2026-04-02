import React from "react"
import { createRoot } from "react-dom/client"
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useParams,
} from "react-router-dom"

import { AppProvider } from "./components/Backend"
import App from "./components/App"
import Home from "./components/Home"
import { ThemeProvider } from "./components/ThemeProvider"
import { appRoot } from "./styles/global.css"
import "./firebase"
import "./theme.css"
import "./styles/global.css"

const ListRoute = () => {
  const { listId } = useParams()

  return (
    <AppProvider listId={listId!}>
      <App />
    </AppProvider>
  )
}

const Root = () => {
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
            <Route path="/list/:listId/*" element={<ListRoute />} />
          </Routes>
        </Router>
      </div>
    </ThemeProvider>
  )
}

createRoot(document.getElementById("root")!).render(<Root />)
