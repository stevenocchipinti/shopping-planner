import React, { FC, ReactNode, useState } from "react"
import { ArrowLeft, Menu as MenuIcon } from "lucide-react"
import { Link, useParams } from "react-router-dom"

import {
  appBar,
  appBarButton,
  appBarShell,
  appBarSlot,
  appBarTitle,
} from "../app-shell.css"
import Menu from "./Menu"
import { IconButton } from "../ui"
import { progressIndicator, progressTrack } from "../ui.css"

interface AppBarProps {
  title?: string
  variant?: string
  loading?: boolean
  back?: string
  actions?: ReactNode
}

const AppBar: FC<AppBarProps> = ({
  title = "Shopping list",
  variant,
  loading,
  back,
  actions = null,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { listId } = useParams()
  const backUrl = back || (listId ? `/list/${listId}` : "/")

  return (
    <>
      <div className={appBarShell}>
        <div className={appBar}>
          <div className={appBarSlot}>
            {variant === "main" ? (
              <IconButton
                className={appBarButton}
                onClick={() => setDrawerOpen(true)}
                aria-label="menu"
              >
                <MenuIcon size={18} />
              </IconButton>
            ) : (
              <Link to={backUrl} aria-label="back">
                <IconButton className={appBarButton} aria-label="back">
                  <ArrowLeft size={18} />
                </IconButton>
              </Link>
            )}
          </div>

          <h1 className={appBarTitle}>{title}</h1>

          <div className={appBarSlot}>{actions}</div>

          {loading ? (
            <div className={progressTrack} aria-hidden>
              <div className={progressIndicator} />
            </div>
          ) : null}
        </div>
      </div>

      {variant === "main" ? (
        <Menu
          open={drawerOpen}
          onOpen={() => setDrawerOpen(true)}
          onClose={() => setDrawerOpen(false)}
        />
      ) : null}
    </>
  )
}

export default AppBar
