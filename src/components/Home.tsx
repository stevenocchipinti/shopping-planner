import React, { FC, useEffect, useState } from "react"
import { Navigate } from "react-router-dom"

import { generateListName } from "./Backend"
import { Spinner } from "./ui"
import { homeContainer, homeCopy, homeTitle } from "./app-shell.css"
import { eyebrow } from "./ui.css"

const LoadingScreen = () => (
  <div className={homeContainer}>
    <p className={eyebrow}>Shopping planner</p>
    <h1 className={homeTitle}>Launching your shared kitchen board.</h1>
    <p className={homeCopy}>
      Syncing the latest list, planner, and recent recipes for the next shop.
    </p>
    <Spinner />
  </div>
)

const Home: FC = () => {
  const [listName, setListName] = useState<string | null | undefined>(undefined)

  useEffect(() => {
    setListName(window.localStorage.getItem("listName"))
  }, [])

  const newList = `/list/${generateListName()}`
  const previousList = `/list/${listName}`

  if (listName === undefined) return <LoadingScreen />
  if (listName === null) return <Navigate to={newList} replace />
  return <Navigate to={previousList} replace />
}

export default Home
