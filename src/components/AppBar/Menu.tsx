import React, { FC, useState } from "react"
import {
  ChevronLeft,
  History,
  Info,
  Share2,
  ArrowRightLeft,
} from "lucide-react"
import { useParams } from "react-router-dom"

import { DarkModeToggle } from "../ThemeProvider"
import { Drawer, IconButton } from "../ui"
import {
  drawerContent,
  drawerCopy,
  drawerDivider,
  drawerFooter,
  drawerHeader,
  drawerHero,
  drawerItem,
  drawerItemIcon,
  drawerItemLabel,
  drawerList,
  drawerTitle,
} from "../app-shell.css"
import AboutDialog from "./AboutDialog"
import OpenDialog from "./OpenDialog"
import ShareDialog from "./ShareDialog"
import { TransitionLink } from "../../viewTransitions"

interface MenuProps {
  open: boolean
  onClose: () => void
}

const Menu: FC<MenuProps> = ({ open, onClose }) => {
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [openDialogOpen, setOpenDialogOpen] = useState(false)
  const [aboutDialogOpen, setAboutDialogOpen] = useState(false)
  const { listId } = useParams()

  return (
    <>
      <OpenDialog
        open={openDialogOpen}
        onClose={() => setOpenDialogOpen(false)}
      />
      <ShareDialog
        open={shareDialogOpen}
        onClose={() => setShareDialogOpen(false)}
      />
      <AboutDialog
        open={aboutDialogOpen}
        onClose={() => setAboutDialogOpen(false)}
      />

      <Drawer open={open} onClose={onClose}>
        <div className={drawerContent}>
          <div className={drawerHeader}>
            <IconButton onClick={onClose} aria-label="Close menu">
              <ChevronLeft size={18} />
            </IconButton>
          </div>

          <div className={drawerHero}>
            <h2 className={drawerTitle}>Shopping planner</h2>
            <p className={drawerCopy}>
              Jump between lists, share the live board, and fine-tune the
              planner.
            </p>
          </div>

          <div className={drawerDivider} />

          <nav className={drawerList}>
            <button
              className={drawerItem}
              type="button"
              onClick={() => {
                onClose()
                setShareDialogOpen(true)
              }}
            >
              <span className={drawerItemIcon}>
                <Share2 size={18} />
              </span>
              <span className={drawerItemLabel}>Share Live List</span>
            </button>

            <button
              className={drawerItem}
              type="button"
              onClick={() => {
                onClose()
                setOpenDialogOpen(true)
              }}
            >
              <span className={drawerItemIcon}>
                <ArrowRightLeft size={18} />
              </span>
              <span className={drawerItemLabel}>Change list</span>
            </button>

            <TransitionLink
              className={drawerItem}
              direction="planner"
              to={`/list/${listId}/catalogue`}
              onClick={() => onClose()}
            >
              <span className={drawerItemIcon}>
                <History size={18} />
              </span>
              <span className={drawerItemLabel}>History</span>
            </TransitionLink>

            <button
              className={drawerItem}
              type="button"
              onClick={() => {
                onClose()
                setAboutDialogOpen(true)
              }}
            >
              <span className={drawerItemIcon}>
                <Info size={18} />
              </span>
              <span className={drawerItemLabel}>About</span>
            </button>
          </nav>

          <div className={drawerFooter}>
            <DarkModeToggle />
          </div>
        </div>
      </Drawer>
    </>
  )
}

export default Menu
