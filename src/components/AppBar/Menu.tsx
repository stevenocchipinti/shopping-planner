import React, { useState, FC } from "react"
import styled from "styled-components"
import { Link, useParams } from "react-router-dom"

import {
  Share as ShareIcon,
  SwapHoriz as SwitchIcon,
  ChevronLeft as ChevronLeftIcon,
  History as HistoryIcon,
  InfoOutlined as AboutIcon,
  Tune as SettingsIcon,
} from "@mui/icons-material"

import {
  Box,
  Divider as MuiDivider,
  IconButton,
  List as MuiList,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  SwipeableDrawer as Drawer,
} from "@mui/material"

import OpenDialog from "./OpenDialog"
import ShareDialog from "./ShareDialog"
import AboutDialog from "./AboutDialog"
import { DarkModeToggle } from "../ThemeProvider"

interface MenuProps {
  open: boolean
  onOpen: () => void
  onClose: () => void
}

const Divider = styled(MuiDivider)`
  && {
    margin-bottom: 12px;
    opacity: 0.6;
  }
`

const List = styled(MuiList)`
  && {
    padding: 0 12px 12px;
  }
`

const MenuItem = styled(ListItemButton)`
  && {
    border-radius: 12px;
    margin-bottom: 4px;
    padding: 12px 16px;
  }
`

const DrawHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: 10px 10px 0;
`

const DrawerInner = styled.div`
  width: min(88vw, 340px);
  min-height: 100%;
  display: flex;
  flex-direction: column;
  padding-bottom: 12px;
`

const DrawerHero = styled.div`
  padding: 18px 18px 10px;
`

const HeroEyebrow = styled.p`
  margin: 0 0 8px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.palette.text.secondary};
`

const HeroTitle = styled.h2`
  margin: 0;
  font-family: "Cormorant Garamond", serif;
  font-size: 28px;
  line-height: 1.1;
  font-weight: 600;
  letter-spacing: -0.01em;
`

const HeroCopy = styled.p`
  margin: 10px 0 0;
  color: ${({ theme }) => theme.palette.text.secondary};
  font-size: 14px;
  line-height: 1.5;
`

const Menu: FC<MenuProps> = ({ open, onOpen, onClose }) => {
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

      <Drawer open={open} onOpen={onOpen} onClose={onClose}>
        <DrawerInner>
          <DrawHeader>
            <IconButton onClick={onClose}>
              <ChevronLeftIcon />
            </IconButton>
          </DrawHeader>
          <DrawerHero>
            <HeroEyebrow>Menu</HeroEyebrow>
            <HeroTitle>Kitchen cockpit</HeroTitle>
            <HeroCopy>
              Jump between lists, share the live board, and fine-tune the planner.
            </HeroCopy>
          </DrawerHero>
          <Divider />
          <List {...{ component: "nav" } as any}>
          {/* TODO: Bring this back
          <ListItem
            button
            component={Link}
            to={`/list/${listId}/recipes`}
            onClick={() => onClose()}
          >
            <ListItemIcon>
              <RecipesIcon />
            </ListItemIcon>
            <ListItemText>Recipes</ListItemText>
          </ListItem> */}

          <ListItem disablePadding>
            <MenuItem
              onClick={() => {
                onClose()
                setShareDialogOpen(true)
              }}
            >
              <ListItemIcon>
                <ShareIcon />
              </ListItemIcon>
              <ListItemText primary="Share Live List" />
            </MenuItem>
          </ListItem>

          <ListItem disablePadding>
            <MenuItem
              onClick={() => {
                onClose()
                setOpenDialogOpen(true)
              }}
            >
              <ListItemIcon>
                <SwitchIcon />
              </ListItemIcon>
              <ListItemText primary="Change list" />
            </MenuItem>
          </ListItem>

          <ListItem disablePadding>
            <MenuItem
              {...{ component: Link } as any}
              to={`/list/${listId}/catalogue`}
              onClick={() => onClose()}
            >
              <ListItemIcon>
                <HistoryIcon />
              </ListItemIcon>
              <ListItemText primary="History" />
            </MenuItem>
          </ListItem>

          <ListItem disablePadding>
            <MenuItem {...{ component: Link } as any} to="/settings" onClick={() => onClose()}>
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </MenuItem>
          </ListItem>

          <ListItem disablePadding>
            <MenuItem
              onClick={() => {
                onClose()
                setAboutDialogOpen(true)
              }}
            >
              <ListItemIcon>
                <AboutIcon />
              </ListItemIcon>
              <ListItemText primary="About" />
            </MenuItem>
          </ListItem>
          </List>
          <Box sx={{ mt: "auto" }}>
            <DarkModeToggle />
          </Box>
        </DrawerInner>
      </Drawer>
    </>
  )
}

export default Menu
