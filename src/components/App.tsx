import React, { FC } from "react"
import { Plus, ShoppingCart, ShoppingCartIcon, CalendarDays, Trash2 } from "lucide-react"
import {
  useLocation,
  Route,
  Routes,
  useParams,
} from "react-router-dom"

import { useAppState, useBackend } from "./Backend"
import AppBar from "./AppBar"
import { AddItemDialog, AddPlanToListDialog } from "./Dialogs"
import History from "./History"
import OfflineNotice from "./OfflineNotice"
import Planner from "./Planner"
import ShoppingLists from "./ShoppingLists"
import {
  appScreen,
  bottomNav,
  bottomNavActivePill,
  bottomNavLinkContent,
  bottomNavLabel,
  bottomNavLink,
  fab,
} from "./app-shell.css"
import { IconButton } from "./ui"
import { NavigationDirection, TransitionLink, useNavigateWithTransition } from "../viewTransitions"

interface BottomNavItemProps {
  active: boolean
  children: React.ReactNode
  direction: NavigationDirection
  to: string
}

const BottomNavItem: FC<BottomNavItemProps> = ({ active, children, direction, to }) => {
  return (
    <TransitionLink
      className={bottomNavLink}
      data-active={active}
      aria-current={active ? "page" : undefined}
      direction={direction}
      replace
      to={to}
    >
      {active ? <span className={bottomNavActivePill} aria-hidden /> : null}
      <span className={bottomNavLinkContent}>{children}</span>
    </TransitionLink>
  )
}

const App: FC = () => {
  const { pathname } = useLocation()
  const { listId } = useParams()
  const tabUrls = [`/list/${listId}`, `/list/${listId}/planner`]
  const navigateWithTransition = useNavigateWithTransition()

  const { items, planner, loading } = useAppState()
  const backend = useBackend()

  const [addDialogOpen, setAddDialogOpen] = React.useState(false)
  const [addPlanToListDialogOpen, setAddPlanToListDialogOpen] = React.useState(false)

  const hasSomeTickedItems = items.some(item => item.done)
  const hasSomePlannedItems = Object.values(planner).some(day => day?.items?.length > 0)

  const navigationItems = [
    { direction: "list" as const, label: "List", icon: <ShoppingCart size={18} />, to: tabUrls[0] },
    { direction: "planner" as const, label: "Planner", icon: <CalendarDays size={18} />, to: tabUrls[1] },
  ]

  const bottomNavigation = (
    <nav className={bottomNav} aria-label="Primary navigation">
      {navigationItems.map(item => (
        <BottomNavItem
          key={item.to}
          active={pathname === item.to}
          direction={item.direction}
          to={item.to}
        >
          {item.icon}
          <span className={bottomNavLabel}>{item.label}</span>
        </BottomNavItem>
      ))}
    </nav>
  )

  return (
    <Routes>
      <Route
        path="catalogue"
        element={
          <div className={appScreen}>
            <AppBar loading={loading} title="History" titleAside={<OfflineNotice />} />
            <History onDelete={item => backend.handleCatalogueDelete(item)} />
          </div>
        }
      />

      <Route
        path="recipes"
        element={
          <div className={appScreen}>
            <AppBar loading={loading} title="History" titleAside={<OfflineNotice />} />
            <History onDelete={item => backend.handleCatalogueDelete(item)} />
          </div>
        }
      />

      <Route
        path="planner"
        element={
          <>
            <div className={appScreen}>
              <AppBar
                title="Weekly planner"
                variant="main"
                loading={loading}
                titleAside={<OfflineNotice />}
                actions={
                  hasSomePlannedItems ? (
                    <IconButton
                      onClick={() => {
                        if (window.confirm("Clear the whole weekly planner?")) {
                          backend.handleClearPlanner()
                        }
                      }}
                      aria-label="Clear planner"
                    >
                      <Trash2 size={18} />
                    </IconButton>
                  ) : null
                }
              />
              <Planner
                onAdd={entry => backend.handleAddToPlanner(entry)}
                onEdit={entry => backend.handleEditPlannerItem(entry)}
                onDelete={entry => backend.handleDeleteFromPlanner(entry)}
              />
            </div>

            <button
              className={fab}
              disabled={loading || !hasSomePlannedItems}
              onClick={() => setAddPlanToListDialogOpen(true)}
              tabIndex={1}
              type="button"
              aria-label="Add planner items to shopping list"
            >
              <ShoppingCartIcon size={22} />
            </button>

            <AddPlanToListDialog
              open={addPlanToListDialogOpen}
              onSubmit={entry => {
                backend.handleAddPlanToList(entry)
                navigateWithTransition(tabUrls[0], { replace: true, direction: "list" })
              }}
              onClose={() => setAddPlanToListDialogOpen(false)}
            />

            {bottomNavigation}
          </>
        }
      />

      <Route
        index
        element={
          <>
            <div className={appScreen}>
              <AppBar
                variant="main"
                actions={
                  hasSomeTickedItems ? (
                    <IconButton
                      onClick={() => backend.handleSweep()}
                      aria-label="Sweep checked items"
                    >
                      <Trash2 size={18} />
                    </IconButton>
                  ) : null
                }
                loading={loading}
                titleAside={<OfflineNotice />}
              />
              <ShoppingLists
                items={items}
                onMark={item => backend.handleMark(item)}
                onEdit={entry => backend.handleEdit(entry)}
                onDelete={item => backend.handleDelete({ name: item.name })}
              />
            </div>

            <button
              className={fab}
              disabled={loading}
              onClick={() => setAddDialogOpen(true)}
              tabIndex={1}
              type="button"
              aria-label="Add shopping item"
            >
              <Plus size={22} />
            </button>

            <AddItemDialog
              open={addDialogOpen}
              onSubmit={entry => backend.handleAdd(entry)}
              onClose={() => setAddDialogOpen(false)}
            />

            {bottomNavigation}
          </>
        }
      />
    </Routes>
  )
}

export default App
