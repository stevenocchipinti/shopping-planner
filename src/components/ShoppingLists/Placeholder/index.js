import React from "react"
import styled from "styled-components"
import { Paper, Zoom } from "@mui/material"

import bread from "./bread.png"
import coffee from "./coffee.png"
import cupcake from "./cupcake.png"
import egg from "./egg.png"
import frenchFries from "./french-fries.png"
import iceCream from "./ice-cream.png"
import pizza from "./pizza.png"
import pumpkin from "./pumpkin.png"
import soda from "./soda.png"
import steak from "./steak.png"
import sushi from "./sushi.png"
import taco from "./taco.png"
import useSetting from "../../../useSetting"

const images = [
  bread,
  coffee,
  cupcake,
  egg,
  frenchFries,
  iceCream,
  pizza,
  pumpkin,
  soda,
  steak,
  sushi,
  taco,
]

const texts = [
  "Empty list",
  "Nada",
  "Niente",
  "Nothing to see here",
  "Nothin' here",
  "All good",
  "Have a great day",
  "Have a nice day",
  "Have an excellent day",
  "Have a fantastic day",
  "No need to go to the shops",
  "Hungry?",
]

const randomFrom = arr => arr[Math.floor(Math.random() * arr.length)]

const Container = styled(Paper).attrs({ elevation: 0, variant: "outlined" })`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 14px;
  width: 100%;
  margin: 0;
  padding: 1rem 1.25rem;
  border-radius: 28px;
  && {
    color: ${({ theme }) => theme.palette.text.secondary};
  }
`

const Image = styled.img`
  width: 40px;
  height: 40px;
  max-width: 100%;
  flex: 0 0 auto;
  object-fit: contain;
`

const Text = styled.p`
  margin: 0;
  text-align: center;
  font-size: 14px;
`

export default () => {
  const [cutePlaceholders] = useSetting("cutePlaceholders")

  const [image, setImage] = React.useState(randomFrom(images))
  const [text, setText] = React.useState(randomFrom(texts))
  const refresh = () => {
    setImage(randomFrom(images))
    setText(randomFrom(texts))
  }

  return (
    <Zoom in={true}>
      <Container onClick={refresh}>
        {cutePlaceholders && <Image src={image} alt="" />}
        <Text>{text}</Text>
      </Container>
    </Zoom>
  )
}
