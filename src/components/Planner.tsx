import React, { useState, FC } from "react"
import styled from "styled-components"

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
} from "@mui/material"

import {
  AddToPlannerParams,
  EditPlannerItemParams,
  DeleteFromPlannerParams,
} from "./Backend/backend"
import { useAppState } from "./Backend"
import { AddPlannerItemDialog, EditPlannerItemDialog } from "./Dialogs"
import Chip from "./Chip"
import { unslugify } from "../helpers"

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

const Wrapper = styled.div`
  max-width: 720px;
  margin: 0 auto;
  padding: 4px 16px 120px;
`

const ChipContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
`

const ChipTableCell = styled(TableCell)`
  padding-left: 0;
  height: 84px;
  width: 100%;
`

const AddButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: transparent;
  border: 1px solid ${({ theme }) => theme.palette.divider};
  border-radius: 999px;
  padding: 7px 13px;
  min-height: 38px;
  cursor: pointer;
  color: ${({ theme }) => theme.palette.text.secondary};
  font-size: 13px;
  font-weight: 500;
  font-family: inherit;
  transition: border-color 0.15s ease, color 0.15s ease, transform 0.15s ease;
  -webkit-tap-highlight-color: transparent;

  &:hover {
    border-color: ${({ theme }) => theme.palette.text.secondary};
    color: ${({ theme }) => theme.palette.text.primary};
  }

  &:active {
    transform: scale(0.97);
  }
`

const PlannerCard = styled(TableContainer)`
  border-radius: 16px;
  overflow: hidden;
`

const Row = styled(TableRow)`
  &:last-child td,
  &:last-child th {
    border-bottom: 0;
  }
`

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
    <Wrapper>
      <PlannerCard as={Paper}>
        <Table aria-label="Planner table">
          <TableBody>
            {days.map(day => (
              <Row key={day}>
                <TableCell component="th" scope="row" sx={{ width: 104, fontWeight: 700 }}>
                  {day}
                </TableCell>
                <ChipTableCell>
                  <ChipContainer>
                    {planner?.[day]?.items?.map(({ name, type }, index) => {
                      const emoji =
                        type === "recipe"
                          ? recipes[name]?.emoji
                          : catalogue[name]?.emoji
                      return (
                        <Chip
                          emoji={emoji}
                          key={index}
                          onClick={() => console.log("Goto", name)}
                          onLongPress={() => {
                            setItemToEdit({ day, name, type })
                            setEditDialogOpen(true)
                          }}
                        >
                          {unslugify(name)}
                        </Chip>
                      )
                    })}
                    {!loading && (
                      <AddButton
                        aria-label="add"
                        onClick={() => {
                          setDay(day)
                          setAddDialogOpen(true)
                        }}
                      >
                        + Add
                      </AddButton>
                    )}
                  </ChipContainer>
                </ChipTableCell>
              </Row>
            ))}
          </TableBody>
        </Table>
      </PlannerCard>

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
    </Wrapper>
  )
}

export default Planner
