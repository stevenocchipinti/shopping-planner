import React from "react"
import styled from "styled-components"

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material"
import { Delete as DeleteIcon } from "@mui/icons-material"

import { unslugify } from "../helpers"
import { useAppState } from "./Backend"

const Wrapper = styled.div`
  max-width: 720px;
  margin: 0 auto;
  padding: 4px 16px 120px;
`

const HeaderCard = styled(Paper)`
  padding: 16px 18px;
  border-radius: 14px;
  margin-bottom: 12px;
  background: ${({ theme }) => theme.app.accentGradient};
`

const TableCard = styled(TableContainer)`
  border-radius: 14px;
  overflow: hidden;
`

const Placeholder = styled(TableCell).attrs({
  colSpan: 3,
  component: "th",
  scope: "row",
  children: "No history yet",
})`
  &&& {
    border: none;
    text-align: center;
    height: 4rem;
    margin: 10px;
    padding: 3rem;
    color: ${({ theme }) => theme.palette.text.secondary};
  }
`

const Catalogue = ({ onDelete }) => {
  const { catalogue, loading } = useAppState()

  return (
    <Wrapper>
      <HeaderCard>
        <Table size="small" aria-hidden>
          <TableBody>
            <TableRow>
              <TableCell sx={{ border: 0, p: 0 }}>
                <strong>Saved sections</strong>
              </TableCell>
              <TableCell sx={{ border: 0, p: 0, color: "text.secondary" }} align="right">
                {Object.keys(catalogue).length} items
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </HeaderCard>
      <TableCard component={Paper}>
        <Table size="small" aria-label="History table">
          <TableHead>
            <TableRow>
              <TableCell>Item</TableCell>
              <TableCell>Section</TableCell>
              <TableCell align="right">Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!loading && Object.keys(catalogue).length === 0 && (
              <TableRow>
                <Placeholder />
              </TableRow>
            )}
            {Object.keys(catalogue).map(item => (
              <TableRow key={item}>
                <TableCell component="th" scope="row">
                  {unslugify(item)}
                </TableCell>
                <TableCell>{catalogue[item].section}</TableCell>
                <TableCell align="right">
                  <IconButton
                    onClick={() => onDelete(item)}
                    aria-label="delete"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableCard>
    </Wrapper>
  )
}

export default Catalogue
