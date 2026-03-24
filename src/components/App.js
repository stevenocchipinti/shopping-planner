import React, { useState } from "react"
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
import { greys } from "../helpers"

const BottomNavigation = styled(MuiBottomNavigation)`
  && {
    position: fixed;
    bottom: 0;
    z-index: 0;
    width: 100%;
    justify-content: space-around;
    border-top: 1px solid ${({ theme }) => theme.palette.divider};
  }
`

const FAB = styled(FloatingActionButton)`
  && {
    position: fixed;
    bottom: 28px;
    right: 0;
    left: 0;
    margin: 0 auto;
    z-index: 1;
  }
  &&:disabled {
    background-color: ${greys("300", "900")};
  }
`

const App = () => {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { listId } = useParams()
  const tabUrls = [`/list/${listId}`, `/list/${listId}/planner`]

  const { items, planner, loading } = useAppState()
  const backend = useBackend()

  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [addPlanToListDialogOpen, setAddPlanToListDialogOpen] = useState(false)

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
          <>
            <AppBar loading={loading} title="History" />
            <Catalogue onDelete={item => backend.handleCatalogueDelete(item)} />
          </>
        }
      />

      <Route path="recipes/:recipeId" element={<Recipe />} />

      <Route
        path="recipes"
        element={
          <>
            <AppBar loading={loading} title="Recipes" />
            <Recipes />
          </>
        }
      />

      <Route
        path="planner"
        element={
          <>
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
              onDelete={entry => backend.handleDelete(entry)}
            />
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
