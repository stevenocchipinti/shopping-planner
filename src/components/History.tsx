import React, { FC } from "react"
import { ChefHat, History as HistoryIcon } from "lucide-react"
import { useLocation, useParams } from "react-router-dom"

import Catalogue from "./Catalogue"
import Recipes from "./Recipes"
import {
  historyTabsWrap,
  pageShell,
} from "./app-shell.css"
import { historySegmentedControl, historySegmentedButton } from "./ui.css"
import { useNavigateWithTransition } from "../viewTransitions"

interface HistoryProps {
  onDelete: (item: string) => void
}

const History: FC<HistoryProps> = ({ onDelete }) => {
  const { pathname } = useLocation()
  const navigateWithTransition = useNavigateWithTransition()
  const { listId } = useParams()
  const activeTab = pathname === `/list/${listId}/recipes` ? "recipes" : "items"

  return (
    <div className={pageShell}>
      <div className={historyTabsWrap}>
        <nav className={historySegmentedControl} aria-label="History sections">
          <button
            className={historySegmentedButton}
            data-selected={activeTab === "items"}
            type="button"
            onClick={() => navigateWithTransition(`/list/${listId}/catalogue`, { replace: true })}
          >
            <HistoryIcon size={16} />
            <span>Items</span>
          </button>
          <button
            className={historySegmentedButton}
            data-selected={activeTab === "recipes"}
            type="button"
            onClick={() => navigateWithTransition(`/list/${listId}/recipes`, { replace: true })}
          >
            <ChefHat size={16} />
            <span>Recipes</span>
          </button>
        </nav>
      </div>

      {activeTab === "items" ? <Catalogue onDelete={onDelete} embedded /> : <Recipes embedded />}
    </div>
  )
}

export default History
