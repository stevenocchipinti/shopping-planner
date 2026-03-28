import React, { FC } from "react"
import styled from "styled-components"
import { Link as RouterLink } from "react-router-dom"
import ReactMasonry from "react-masonry-css"
import { Paper, Typography } from "@mui/material"

import { useAppState } from "../Backend"
import { Emoji } from "../Emoji"
import placeholderImg from "./fork_knife.svg"

const gutter = "1rem"

const Link = styled(RouterLink)`
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`

const Placeholder = styled(Paper).attrs({ elevation: 0, variant: "outlined" })`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 10px;
  padding: 3rem;
  && {
    color: ${({ theme }) => theme.palette.text.secondary};
  }
`

const Masonry = styled(ReactMasonry)`
  display: flex;
  margin-left: -${gutter};
  padding: ${gutter};
  width: auto;

  .masonry-column {
    padding-left: ${gutter};
    background-clip: padding-box;
  }
`

const Image = styled.img`
  border-radius: 10px;
  width: 100%;
`

const Figure = styled.figure`
  width: 100%;
  margin: 0 0 ${gutter};
`

const PlaceholderTile = styled(Paper)`
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
`

const PlaceholderImage = styled.img`
  height: 60px;
`

interface PlaceholderRecipeProps {
  emoji?: string | null
}

const PlaceholderRecipe: FC<PlaceholderRecipeProps> = ({ emoji }) => (
  <PlaceholderTile>
    {emoji ? <Emoji size={50} emoji={emoji} /> : <PlaceholderImage src={placeholderImg} alt="" />}
  </PlaceholderTile>
)

interface TileProps {
  image?: string
  title?: string
  to: string
  emoji?: string | null
}

const Tile: FC<TileProps> = ({ image, title, to, emoji }) => (
  <Link to={to}>
    <Figure>
      {image ? <Image src={image} alt="" /> : <PlaceholderRecipe emoji={emoji} />}
      <Typography color="text.secondary" component="figcaption">
        {title}
      </Typography>
    </Figure>
  </Link>
)

const Recipes: FC = () => {
  const { recipes } = useAppState()

  if (Object.keys(recipes).length === 0)
    return (
      <Placeholder>
        <Typography paragraph>No recipes yet</Typography>
        <Typography align="center">
          Add items with ingredients to the planner to create recipes
        </Typography>
      </Placeholder>
    )

  return (
    <Masonry columnClassName="masonry-column">
      {Object.keys(recipes).map(slug => {
        const { title, image, emoji } = recipes[slug]
        return (
          <Tile
            key={slug}
            to={slug}
            title={title}
            image={image}
            emoji={emoji}
          />
        )
      })}
    </Masonry>
  )
}

export default Recipes
