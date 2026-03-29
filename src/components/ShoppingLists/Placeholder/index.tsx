import React, { FC, useState } from "react"

import { placeholderCard, placeholderImage, placeholderText } from "../../listing.css"
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

const randomFrom = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]

const Placeholder: FC = () => {
  const [image, setImage] = useState(randomFrom(images))
  const [text, setText] = useState(randomFrom(texts))

  const refresh = () => {
    setImage(randomFrom(images))
    setText(randomFrom(texts))
  }

  return (
    <button className={placeholderCard} type="button" onClick={refresh}>
      <img className={placeholderImage} src={image} alt="" />
      <p className={placeholderText}>{text}</p>
    </button>
  )
}

export default Placeholder
