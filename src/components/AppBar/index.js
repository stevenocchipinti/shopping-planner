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
  padding: max(10px, env(safe-area-inset-top)) 12px 6px;
  backdrop-filter: blur(18px);
`

const Bar = styled(MuiAppBar)`
  && {
    position: relative;
    border: 1px solid ${({ theme }) => theme.app.border};
    border-radius: 28px;
    background: ${({ theme }) => theme.app.shell};
    box-shadow: ${({ theme }) => theme.app.shellShadow};
    overflow: hidden;
  }
`

const Title = styled(Typography)`
  && {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 44px;
    padding: 0 6px;
    line-height: 1;
    text-align: center;
  }
`

const SideSlot = styled.div`
  width: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const HeaderIconButton = styled(IconButton)`
  && {
    background-color: transparent;
  }

  &&:hover {
    background-color: ${({ theme }) =>
      theme.palette.mode === "dark"
        ? "rgba(255, 255, 255, 0.08)"
        : "rgba(33, 50, 43, 0.08)"};
  }
`

const ProgressTrack = styled.div`
  position: absolute;
  right: 18px;
  bottom: 12px;
  left: 18px;
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
        <LinearProgress variant="indeterminate" sx={{ borderRadius: 999, height: 4 }} />
      </ProgressTrack>
    ) : null

  return (
    <>
      <Shell>
        <Bar position="static">
          <Toolbar
            sx={{
              minHeight: 78,
              px: 1,
              display: "grid",
              gridTemplateColumns: "48px minmax(0, 1fr) 48px",
              alignItems: "center",
              columnGap: 1,
            }}
          >
            <SideSlot>
              {variant === "main" ? (
                <HeaderIconButton
                  onClick={() => setDrawerOpen(true)}
                  color="inherit"
                  edge="start"
                  aria-label="menu"
                >
                  <MenuIcon />
                </HeaderIconButton>
              ) : (
                <HeaderIconButton
                  component={Link}
                  to={backUrl}
                  color="inherit"
                  edge="start"
                  aria-label="back"
                >
                  <BackIcon />
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
