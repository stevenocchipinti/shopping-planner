import React, { useState, FC } from "react"
import styled from "styled-components"

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField as MuiTextField,
  Button,
  Typography,
} from "@mui/material"
import AutoComplete from "../Autocomplete"

import { Link, useNavigate, useParams } from "react-router-dom"
import useLocalStorage from "../../useLocalStorage"
import { generateListName } from "../../components/Backend"

interface OpenDialogProps {
  open: boolean
  onClose: () => void
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  height: 100%;
`

const Actions = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 250px;
  && > * {
    margin-bottom: 1rem;
  }
`

const TextField = styled(MuiTextField)`
  & .MuiInputBase-root {
    min-height: 48px;
  }
`

const OpenDialog: FC<OpenDialogProps> = ({ open, onClose }) => {
  const [listMRU, setListMRU] = useLocalStorage<string[]>("listMRU", [])
  const [newList, setNewList] = useState("")
  const navigate = useNavigate()
  const { listId: id } = useParams()

  const addToListMRU = (list: string) => setListMRU([...new Set([...listMRU, list])])
  const removeFromListMRU = (list: string) => setListMRU(listMRU.filter(l => l !== list))

  const openList = (e: React.FormEvent) => {
    e.preventDefault()
    if (newList.length === 0) return
    let list = newList
    try {
      const url = new URL(newList)
      const match = url.pathname.match(/\/list\/([^/]+)/)
      if (match) {
        list = match[1]
      }
    } catch (error) {}
    addToListMRU(list)
    navigate(`/list/${list}`)
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <Form onSubmit={openList} autoComplete="off">
        <DialogTitle>Change list</DialogTitle>
        <DialogContent>
          <DialogContentText>Your list ID: {id}</DialogContentText>
          <Actions>
            <p>Open an existing list:</p>

            {/* Having `-search` in the id stops lastpass autocomplete */}
            <AutoComplete
              id="list-search"
              options={listMRU}
              inputValue={newList}
              onInputChange={(e: React.SyntheticEvent | null, newValue: string) => e && setNewList(newValue)}
              onDelete={removeFromListMRU}
              autoFocus
              renderInput={(params: any) => (
                <TextField
                  {...params}
                  variant="outlined"
                  placeholder="ID or URL"
                  autoFocus
                  id="open"
                  fullWidth={true}
                  size="small"
                />
              )}
            />

            <Typography align="center">or</Typography>
            <Button
              component={Link}
              onClick={onClose}
              to={`/list/${generateListName()}`}
              color="primary"
              variant="outlined"
              size="large"
            >
              Create new list
            </Button>
          </Actions>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            disabled={newList.length === 0}
            variant="contained"
            type="submit"
            color="primary"
          >
            Open
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
  )
}

export default OpenDialog
