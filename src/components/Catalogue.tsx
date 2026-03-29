import React, { FC } from "react"
import { Trash2 } from "lucide-react"

import { normalizeSection, unslugify } from "../helpers"
import { useAppState } from "./Backend"
import {
  headerSummaryCard,
  headerSummaryRow,
  placeholderRow,
  table,
  tableCard,
  tableCell,
  tableCellRight,
  tableCellStrong,
  tableHeadCell,
  tableWrapper,
} from "./listing.css"
import { IconButton } from "./ui"

interface CatalogueProps {
  onDelete: (item: string) => void
}

const Catalogue: FC<CatalogueProps> = ({ onDelete }) => {
  const { catalogue, loading } = useAppState()
  const entries = Object.keys(catalogue)

  return (
    <div className={tableWrapper}>
      <div className={headerSummaryCard}>
        <div className={headerSummaryRow}>
          <strong>Saved sections</strong>
          <span>{entries.length} items</span>
        </div>
      </div>

      <div className={tableCard}>
        <table className={table} aria-label="History table">
          <thead>
            <tr>
              <th className={tableHeadCell}>Item</th>
              <th className={tableHeadCell}>Section</th>
              <th className={`${tableHeadCell} ${tableCellRight}`}>Delete</th>
            </tr>
          </thead>
          <tbody>
            {!loading && entries.length === 0 ? (
              <tr>
                <th className={placeholderRow} colSpan={3} scope="row">
                  No history yet
                </th>
              </tr>
            ) : null}

            {entries.map(item => (
              <tr key={item}>
                <th className={`${tableCell} ${tableCellStrong}`} scope="row">
                  {unslugify(item)}
                </th>
                <td className={tableCell}>{normalizeSection(catalogue[item].section || "")}</td>
                <td className={`${tableCell} ${tableCellRight}`}>
                  <IconButton onClick={() => onDelete(item)} aria-label={`Delete ${unslugify(item)}`}>
                    <Trash2 size={18} />
                  </IconButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Catalogue
