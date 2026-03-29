import React, { FC } from "react"
import { ArrowLeft, Instagram, Trash2 } from "lucide-react"
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom"

import { unslugify } from "../helpers"
import { useAppState, useBackend } from "./Backend"
import { recipeBackButton, recipeCard, recipeDescription, recipeImage, recipeLink, recipeTitle, recipeTitleRow, recipeWrapper } from "./app-shell.css"
import AppBar from "./AppBar"
import { Emoji } from "./Emoji"
import { IconButton } from "./ui"

const Recipe: FC = () => {
  const navigate = useNavigate()
  const { recipeId, listId } = useParams()
  const { recipes } = useAppState()
  const { handleRecipeDelete } = useBackend()
  const recipe = recipes?.[recipeId || ""]
  if (!recipe) return null

  const back = `/list/${listId}/recipes`
  const title = unslugify(recipeId || "")
  const { emoji, image, description, instagram, ingredients } = recipe

  return (
    <>
      {image ? (
        <>
          <RouterLink to={back} aria-label="Back to recipes">
            <IconButton className={recipeBackButton} aria-label="Back">
              <ArrowLeft size={18} />
            </IconButton>
          </RouterLink>
          <img className={recipeImage} src={image} alt="" />
        </>
      ) : (
        <AppBar
          title=""
          back={back}
          actions={
            <IconButton
              onClick={() => {
                handleRecipeDelete(recipeId!)
                navigate(`/list/${listId}/recipes`, { replace: true })
              }}
              aria-label="Delete recipe"
            >
              <Trash2 size={18} />
            </IconButton>
          }
        />
      )}

      <div className={recipeWrapper}>
        <div className={recipeTitleRow}>
          {emoji ? <Emoji emoji={emoji} size={40} /> : null}
          <h1 className={recipeTitle}>{title}</h1>
        </div>

        <div className={recipeCard}>
          {instagram ? (
            <a className={recipeLink} href={instagram} rel="noopener noreferrer" target="_blank">
              <Instagram size={18} /> Instagram
            </a>
          ) : null}

          {description ? <div className={recipeDescription}>{description}</div> : null}

          {ingredients ? (
            <ul>
              {ingredients.map(ingredient => (
                <li key={ingredient.slug}>{unslugify(ingredient.slug)}</li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </>
  )
}

export default Recipe
