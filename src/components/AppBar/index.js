import React, { useState } from "react"
import styled from "styled-components"
import { Link, useParams } from "react-router-dom"

import {
  AppBar as MuiAppBar,
  LinearProgress,
  Toolbar,
  Typography,
  IconButton,
} from "@mui/material"
import { Menu as MenuIcon, ArrowBack as BackIcon } from "@mui/icons-material"

import Menu from "./Menu"

const Shell = styled.div`
  position: sticky;
  top: 0;
  z-index: 20;
  padding: max(8px, env(safe-area-inset-top)) 16px 4px;
  backdrop-filter: blur(12px);
  background: ${({ theme }) =>
    theme.palette.mode === "dark"
      ? "rgba(23, 28, 25, 0.85)"
      : "rgba(247, 243, 237, 0.85)"};
`

const Bar = styled(MuiAppBar)`
  && {
    position: relative;
    border: none;
    border-radius: 0;
    background: transparent;
    box-shadow: none;
    overflow: hidden;
  }
`

const Title = styled(Typography)`
  && {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 40px;
    padding: 0;
    line-height: 1;
    text-align: center;
    font-family: "Cormorant Garamond", serif;
    font-weight: 600;
    font-size: 1.35rem;
  }
`

const SideSlot = styled.div`
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const HeaderIconButton = styled(IconButton)`
  && {
    background-color: transparent;
    opacity: 0.5;
  }

  &&:hover {
    opacity: 0.8;
    background-color: transparent;
  }
`

const ProgressTrack = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  pointer-events: none;
`

const AppBar = ({
  title = "Shopping list",
  variant,
  loading,
  back,
  actions = [],
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { listId } = useParams()
  const backUrl = back || (listId ? `/list/${listId}` : "/")

  const loadingIndicator = () =>
    loading ? (
      <ProgressTrack>
        <LinearProgress variant="indeterminate" sx={{ height: 2 }} />
      </ProgressTrack>
    ) : null

  return (
    <>
      <Shell>
        <Bar position="static">
          <Toolbar
            sx={{
              minHeight: 56,
              px: 0,
              display: "grid",
              gridTemplateColumns: "40px minmax(0, 1fr) 40px",
              alignItems: "center",
              columnGap: 0.5,
            }}
          >
            <SideSlot>
              {variant === "main" ? (
                <HeaderIconButton
                  onClick={() => setDrawerOpen(true)}
                  color="inherit"
                  edge="start"
                  aria-label="menu"
                  size="small"
                >
                  <MenuIcon fontSize="small" />
                </HeaderIconButton>
              ) : (
                <HeaderIconButton
                  component={Link}
                  to={backUrl}
                  color="inherit"
                  edge="start"
                  aria-label="back"
                  size="small"
                >
                  <BackIcon fontSize="small" />
                </HeaderIconButton>
              )}
            </SideSlot>

            <Title variant="h5" component="h1" noWrap>
              {title}
            </Title>

            <SideSlot>{actions}</SideSlot>
          </Toolbar>

          {loadingIndicator()}
        </Bar>
      </Shell>

      {variant === "main" && (
        <Menu
          open={drawerOpen}
          onOpen={() => setDrawerOpen(true)}
          onClose={() => setDrawerOpen(false)}
        />
      )}
    </>
  )
}

export default AppBar
