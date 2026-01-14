import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { HomePage } from "@/pages/home"
import { SettingsPage } from "@/pages/settings"
import { ListLayout } from "@/components/layout/list-layout"
import { ListPage } from "@/pages/list"
import { PlannerPage } from "@/pages/planner"
import { CataloguePage } from "@/pages/catalogue"

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/list/:listId" element={<ListLayout />}>
            <Route index element={<ListPage />} />
            <Route path="planner" element={<PlannerPage />} />
            <Route path="catalogue" element={<CataloguePage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
