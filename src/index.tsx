import React from "react"
import { createRoot } from "react-dom/client"
import {
  RouterProvider,
  createBrowserRouter,
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

const router = createBrowserRouter(
  [
    { path: "/", element: <Home /> },
    { path: "/list/:listId/*", element: <ListRoute /> },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  }
)

const Root = () => {
  return (
    <ThemeProvider>
      <div className={appRoot}>
        <RouterProvider router={router} />
      </div>
    </ThemeProvider>
  )
}

createRoot(document.getElementById("root")!).render(<Root />)
