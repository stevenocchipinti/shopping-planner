import React, { FC, ReactNode, useState } from "react"
import { ArrowLeft, Menu as MenuIcon } from "lucide-react"
import { useParams } from "react-router-dom"

import {
  appBar,
  appBarButton,
  appBarShell,
  appBarSlot,
  appBarTitle,
} from "../app-shell.css"
import Menu from "./Menu"
import { IconButton } from "../ui"
import { iconButtonLink, progressIndicator, progressTrack } from "../ui.css"
import { TransitionLink } from "../../viewTransitions"

interface AppBarProps {
  title?: string
  variant?: string
  loading?: boolean
  back?: string
  actions?: ReactNode
  titleAside?: ReactNode
}

const AppBar: FC<AppBarProps> = ({
  title = "Shopping list",
  variant,
  loading,
  back,
  actions = null,
  titleAside = null,
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
              <TransitionLink
                className={`${iconButtonLink()} ${appBarButton}`}
                direction="list"
                to={backUrl}
                aria-label="back"
              >
                <ArrowLeft size={18} />
              </TransitionLink>
            )}
          </div>

          <div className={appBarTitle}>
            <span>{title}</span>
            {titleAside}
          </div>

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
          onClose={() => setDrawerOpen(false)}
        />
      ) : null}
    </>
  )
}

export default AppBar
