import React, { FC, useMemo, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"

import AutoComplete from "../Autocomplete"
import { generateListName } from "../../components/Backend"
import useLocalStorage from "../../useLocalStorage"
import Dialog from "../Dialogs/Dialog"
import { Button } from "../ui"
import { centeredText, dialogActions, openDialogActions, spacer } from "../dialogs.css"
import {
  dialogBody,
  dialogDescription,
  dialogHeader,
  dialogTitle,
  field,
  fieldLabel,
} from "../ui.css"

interface OpenDialogProps {
  open: boolean
  onClose: () => void
}

const OpenDialog: FC<OpenDialogProps> = ({ open, onClose }) => {
  const [listMRU, setListMRU] = useLocalStorage<string[]>("listMRU", [])
  const [newList, setNewList] = useState("")
  const navigate = useNavigate()
  const { listId: id } = useParams()

  const addToListMRU = (list: string) => setListMRU([...new Set([...listMRU, list])])
  const removeFromListMRU = (list: string) => setListMRU(listMRU.filter(l => l !== list))

  const cleanedValue = useMemo(() => newList.trim(), [newList])

  const openList = (event: React.FormEvent) => {
    event.preventDefault()
    if (cleanedValue.length === 0) return

    let list = cleanedValue

    try {
      const url = new URL(cleanedValue)
      const match = url.pathname.match(/\/list\/([^/]+)/)
      if (match) {
        list = match[1]
      }
    } catch {}

    addToListMRU(list)
    navigate(`/list/${list}`)
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} onSubmit={openList}>
      <div className={dialogHeader}>
        <h2 className={dialogTitle}>Change list</h2>
      </div>

      <div className={dialogBody}>
        <p className={dialogDescription}>Your list ID: {id}</p>
        <div className={openDialogActions}>
          <label className={field}>
            <span className={fieldLabel}>Open an existing list</span>
            <AutoComplete
              id="list-search"
              placeholder="ID or URL"
              options={listMRU}
              inputValue={newList}
              onInputChange={(_, value) => setNewList(value)}
              onDelete={removeFromListMRU}
              autoFocus
            />
          </label>

          <p className={centeredText}>or</p>

          <Link to={`/list/${generateListName()}`} onClick={onClose}>
            <Button variant="outline" size="lg" fullWidth>
              Create new list
            </Button>
          </Link>
        </div>
      </div>

      <div className={dialogActions}>
        <span className={spacer} />
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="solid" type="submit" disabled={cleanedValue.length === 0}>
          Open
        </Button>
      </div>
    </Dialog>
  )
}

export default OpenDialog
