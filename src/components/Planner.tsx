import React, { FC, useState } from "react"

import { unslugify } from "../helpers"
import {
  AddToPlannerParams,
  DeleteFromPlannerParams,
  EditPlannerItemParams,
} from "./Backend/backend"
import { useAppState } from "./Backend"
import Chip from "./Chip"
import { AddPlannerItemDialog, EditPlannerItemDialog } from "./Dialogs"
import {
  plannerAddButton,
  plannerChipCell,
  plannerChipContainer,
  table,
  tableCard,
  tableCell,
  tableCellStrong,
  tableWrapper,
} from "./listing.css"

interface PlannerItem {
  name: string
  day: string
  type: string
}

interface PlannerProps {
  onAdd: (entry: AddToPlannerParams) => void
  onEdit: (entry: EditPlannerItemParams) => void
  onDelete: (entry: DeleteFromPlannerParams) => void
}

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
]

const Planner: FC<PlannerProps> = ({ onAdd, onEdit, onDelete }) => {
  const { planner, recipes, catalogue, loading } = useAppState()
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [day, setDay] = useState<string | null>(null)
  const [itemToEdit, setItemToEdit] = useState<PlannerItem | undefined>(undefined)

  return (
    <div className={tableWrapper}>
      <div className={tableCard}>
        <table className={table} aria-label="Planner table">
          <tbody>
            {days.map(entryDay => (
              <tr key={entryDay}>
                <th className={`${tableCell} ${tableCellStrong}`} scope="row" style={{ width: 104 }}>
                  {entryDay}
                </th>
                <td className={`${tableCell} ${plannerChipCell}`}>
                  <div className={plannerChipContainer}>
                    {planner?.[entryDay]?.items?.map(({ name, type }, index) => {
                      const emoji = type === "recipe" ? recipes[name]?.emoji : catalogue[name]?.emoji
                      return (
                        <Chip
                          emoji={emoji}
                          key={index}
                          onLongPress={() => {
                            setItemToEdit({ day: entryDay, name, type })
                            setEditDialogOpen(true)
                          }}
                        >
                          {unslugify(name)}
                        </Chip>
                      )
                    })}
                    {!loading ? (
                      <button
                        className={plannerAddButton}
                        aria-label={`Add item for ${entryDay}`}
                        onClick={() => {
                          setDay(entryDay)
                          setAddDialogOpen(true)
                        }}
                        type="button"
                      >
                        + Add
                      </button>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AddPlannerItemDialog
        day={day}
        days={days}
        open={addDialogOpen}
        onChangeDay={setDay}
        onSubmit={onAdd}
        onClose={() => setAddDialogOpen(false)}
      />

      <EditPlannerItemDialog
        item={itemToEdit}
        days={days}
        open={editDialogOpen}
        onSubmit={onEdit}
        onDelete={onDelete}
        onClose={() => setEditDialogOpen(false)}
      />
    </div>
  )
}

export default Planner
