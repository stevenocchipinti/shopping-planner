import React, { useState, useEffect } from "react"
import styled from "styled-components"
import { Navigate } from "react-router-dom"
import { CircularProgress } from "@mui/material"

import { generateListName } from "./Backend"

const Container = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 100px;
`

const LoadingScreen = () => (
  <Container>
    <CircularProgress />
  </Container>
)

const Home = props => {
  const [listName, setListName] = useState()

  useEffect(() => {
    setListName(window.localStorage.getItem("listName"))
  }, [])

  const newList = `/list/${generateListName()}`
  const previousList = `/list/${listName}`

  if (listName === undefined) return <LoadingScreen />
  else if (listName === null) return <Navigate to={newList} replace />
  else return <Navigate to={previousList} replace />
}

export default Home
