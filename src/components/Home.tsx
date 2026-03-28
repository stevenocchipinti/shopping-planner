import React, { useState, useEffect, FC } from "react"
import styled from "styled-components"
import { Navigate } from "react-router-dom"
import { CircularProgress } from "@mui/material"

import { generateListName } from "./Backend"

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px;
  text-align: center;
`

const Badge = styled.p`
  margin: 0 0 10px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.palette.text.secondary};
`

const Title = styled.h1`
  margin: 0 0 10px;
  font-family: "Fraunces", serif;
  font-size: clamp(2.6rem, 10vw, 4.5rem);
  line-height: 0.94;
`

const Copy = styled.p`
  margin: 0 0 24px;
  max-width: 26rem;
  color: ${({ theme }) => theme.palette.text.secondary};
  line-height: 1.6;
`

const LoadingScreen = () => (
  <Container>
    <Badge>Shopping planner</Badge>
    <Title>Launching your shared kitchen board.</Title>
    <Copy>Syncing the latest list, planner, and recent recipes for the next shop.</Copy>
    <CircularProgress />
  </Container>
)

const Home: FC = () => {
  const [listName, setListName] = useState<string | null | undefined>(undefined)

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
