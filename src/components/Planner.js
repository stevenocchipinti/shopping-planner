import React, { useState } from "react"
import styled from "styled-components"

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material"
import { Add as AddIcon } from "@mui/icons-material"

import { useAppState } from "./Backend"
import { AddPlannerItemDialog, EditPlannerItemDialog } from "./Dialogs"
import Chip from "./Chip"
import { unslugify } from "../helpers"

const Wrapper = styled.div`
  max-width: 720px;
  margin: 0 auto;
  padding: 4px 16px 120px;
`

const ChipContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
`

const ChipTableCell = styled(TableCell)`
  padding-left: 0;
  height: 84px;
  width: 100%;
`

const AddButton = styled(IconButton).attrs({
  "aria-label": "add",
  children: <AddIcon />,
  size: "small",
})`
  && {
    border: 1px dashed ${({ theme }) => theme.palette.text.secondary};
    margin: 4px;
    border-radius: 999px;
    min-width: 42px;
    min-height: 42px;
  }
`

const PlannerCard = styled(TableContainer)`
  border-radius: 16px;
  overflow: hidden;
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

const Planner = ({ onAdd, onEdit, onDelete }) => {
  const { planner, recipes, catalogue, loading } = useAppState()
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [day, setDay] = useState(null)
  const [itemToEdit, setItemToEdit] = useState({})

  return (
    <Wrapper>
      <PlannerCard component={Paper}>
        <Table aria-label="Planner table">
          <TableBody>
            {days.map(day => (
              <TableRow key={day}>
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
                        onClick={() => {
                          setDay(day)
                          setAddDialogOpen(true)
                        }}
                      />
                    )}
                  </ChipContainer>
                </ChipTableCell>
              </TableRow>
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
