import React, { FC } from "react"
import { Link as RouterLink } from "react-router-dom"
import ReactMasonry from "react-masonry-css"

import { useAppState } from "../Backend"
import { Emoji } from "../Emoji"
import {
  emptyRecipes,
  recipeFigcaption,
  recipeFigure,
  recipeTileImage,
  recipeTileLink,
  recipeTilePlaceholder,
  recipeTilePlaceholderImage,
  recipesMasonry,
} from "../app-shell.css"
import placeholderImg from "./fork_knife.svg"

interface PlaceholderRecipeProps {
  emoji?: string | null
}

const PlaceholderRecipe: FC<PlaceholderRecipeProps> = ({ emoji }) => (
  <div className={recipeTilePlaceholder}>
    {emoji ? <Emoji size={50} emoji={emoji} /> : <img className={recipeTilePlaceholderImage} src={placeholderImg} alt="" />}
  </div>
)

interface TileProps {
  image?: string
  title?: string
  to: string
  emoji?: string | null
}

const Tile: FC<TileProps> = ({ image, title, to, emoji }) => (
  <RouterLink className={recipeTileLink} to={to}>
    <figure className={recipeFigure}>
      {image ? <img className={recipeTileImage} src={image} alt="" /> : <PlaceholderRecipe emoji={emoji} />}
      <figcaption className={recipeFigcaption}>{title}</figcaption>
    </figure>
  </RouterLink>
)

const Recipes: FC = () => {
  const { recipes } = useAppState()

  if (Object.keys(recipes).length === 0) {
    return (
      <div className={emptyRecipes}>
        <p>No recipes yet</p>
        <p>Add items with ingredients to the planner to create recipes</p>
      </div>
    )
  }

  return (
    <ReactMasonry className={recipesMasonry} columnClassName="masonry-column">
      {Object.keys(recipes).map(slug => {
        const { title, image, emoji } = recipes[slug]
        return <Tile key={slug} to={slug} title={title} image={image} emoji={emoji} />
      })}
    </ReactMasonry>
  )
}

export default Recipes
