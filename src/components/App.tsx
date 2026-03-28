import React, { FC } from "react"
import styled from "styled-components"
import {
  Link,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom"

import {
  IconButton,
  Fab as FloatingActionButton,
  BottomNavigation as MuiBottomNavigation,
  BottomNavigationAction,
  Zoom,
} from "@mui/material"

import {
  ShoppingCart as ListIcon,
  Add as ContentAddIcon,
  AddShoppingCart as AddShoppingCartIcon,
  Event as PlannerIcon,
  DeleteSweep as SweepIcon,
} from "@mui/icons-material"

import { useAppState, useBackend } from "./Backend"
import AppBar from "./AppBar"
import ShoppingLists from "./ShoppingLists"
import Catalogue from "./Catalogue"
import Recipes from "./Recipes"
import Recipe from "./Recipe"
import Planner from "./Planner"
import { AddItemDialog, AddPlanToListDialog } from "./Dialogs"

const BottomNavigation = styled(MuiBottomNavigation)`
  && {
    position: fixed;
    bottom: max(10px, env(safe-area-inset-bottom));
    left: 16px;
    right: 16px;
    z-index: 15;
    width: auto;
    justify-content: center;
    gap: 4px;
    border: 1px solid ${({ theme }) => theme.palette.divider};
    border-radius: 16px;
    background: ${({ theme }) => theme.app.shell};
    backdrop-filter: blur(12px);
    box-shadow: ${({ theme }) => theme.app.shellShadow};
    overflow: hidden;
    padding: 4px 8px;
    min-height: 60px;
    align-items: stretch;
  }

  && .MuiBottomNavigationAction-root {
    min-height: 52px;
    padding: 6px 12px 4px;
  }

  && .MuiBottomNavigationAction-label {
    margin-top: 2px;
  }
`

const FAB = styled(FloatingActionButton)`
  && {
    position: fixed;
    bottom: calc(78px + max(10px, env(safe-area-inset-bottom)));
    right: 20px;
    left: auto;
    margin: 0;
    z-index: 16;
  }

  &&:disabled {
    background: ${({ theme }) => theme.palette.divider};
    color: ${({ theme }) => theme.palette.text.secondary};
  }
`

const Screen = styled.div`
  max-width: 720px;
  margin: 0 auto;
  min-height: 100dvh;
  padding: 0 0 calc(120px + max(10px, env(safe-area-inset-bottom)));
`

const App: FC = () => {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { listId } = useParams()
  const tabUrls = [`/list/${listId}`, `/list/${listId}/planner`]

  const { items, planner, loading } = useAppState()
  const backend = useBackend()

  const [addDialogOpen, setAddDialogOpen] = React.useState(false)
  const [addPlanToListDialogOpen, setAddPlanToListDialogOpen] = React.useState(false)

  const hasSomeTickedItems = items.some(item => item.done)
  const hasSomePlannedItems = Object.values(planner).some(
    day => day?.items?.length > 0
  )

  const bottomNavigation = (
    <BottomNavigation
      value={tabUrls.findIndex(url => pathname === url)}
      showLabels
    >
      <BottomNavigationAction
        label="List"
        icon={<ListIcon />}
        component={Link}
        to={tabUrls[0]}
        replace
      />
      <BottomNavigationAction
        label="Planner"
        icon={<PlannerIcon />}
        component={Link}
        to={tabUrls[1]}
        replace
      />
    </BottomNavigation>
  )

  return (
    <Routes>
      <Route
        path="catalogue"
        element={
          <Screen>
            <AppBar loading={loading} title="History" />
            <Catalogue onDelete={item => backend.handleCatalogueDelete(item)} />
          </Screen>
        }
      />

      <Route path="recipes/:recipeId" element={<Recipe />} />

      <Route
        path="recipes"
        element={
          <Screen>
            <AppBar loading={loading} title="Recipes" />
            <Recipes />
          </Screen>
        }
      />

      <Route
        path="planner"
        element={
          <>
            <Screen>
              <AppBar
                title="Weekly planner"
                variant="main"
                loading={loading}
                actions={
                  hasSomePlannedItems && (
                    <IconButton
                      onClick={() => backend.handleClearPlanner()}
                      color="inherit"
                      edge="end"
                      aria-label="Clear"
                    >
                      <SweepIcon />
                    </IconButton>
                  )
                }
              />
              <Planner
                onAdd={entry => backend.handleAddToPlanner(entry)}
                onEdit={entry => backend.handleEditPlannerItem(entry)}
                onDelete={entry => backend.handleDeleteFromPlanner(entry)}
              />
            </Screen>
            <FAB
              disabled={loading || !hasSomePlannedItems}
              onClick={() => setAddPlanToListDialogOpen(true)}
              color="primary"
              tabIndex={1}
            >
              <AddShoppingCartIcon />
            </FAB>
            <AddPlanToListDialog
              open={addPlanToListDialogOpen}
              onSubmit={entry => {
                backend.handleAddPlanToList(entry)
                navigate(tabUrls[0], { replace: true })
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
            <Screen>
              <AppBar
                variant="main"
                actions={
                  <Zoom in={hasSomeTickedItems}>
                    <IconButton
                      onClick={() => backend.handleSweep()}
                      color="inherit"
                      edge="end"
                      aria-label="Sweep"
                    >
                      <SweepIcon />
                    </IconButton>
                  </Zoom>
                }
                loading={loading}
              />
              <ShoppingLists
                items={items}
                onMark={item => backend.handleMark(item)}
                onEdit={entry => backend.handleEdit(entry)}
                onDelete={item => backend.handleDelete({ name: item.name })}
              />
            </Screen>
            <FAB
              disabled={loading}
              onClick={() => setAddDialogOpen(true)}
              color="primary"
              tabIndex={1}
            >
              <ContentAddIcon />
            </FAB>
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
