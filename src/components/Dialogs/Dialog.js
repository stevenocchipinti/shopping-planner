import React, { forwardRef } from "react"
import styled from "styled-components"
import { Dialog as MuiDialog, Slide, useMediaQuery } from "@mui/material"
import { useTheme } from "@mui/material/styles"

const StyledDialog = styled(MuiDialog)`
  user-select: none;
  & .MuiDialog-paper:not(.MuiDialog-paperFullScreen) {
    min-width: min(460px, calc(100vw - 24px));
  }
  max-height: 100vmin;
`

// The form is nessesary to get the mobile keyboards to tab through the
// fields and the styling is needed because the DialogTitle, DialogContent,
// DialogActions, etc. are expected to be flex children of the Dialog
// component but now they are children of the form element
const Form = styled.form`
  display: flex;
  flex-direction: column;
  height: 100%;

  .MuiFormControl-root {
    margin-top: 4px;
  }

  .MuiDialogTitle-root {
    padding: 20px 20px 8px;
  }

  .MuiDialogContent-root {
    padding: 16px 20px 8px;
    overflow: visible;
  }

  .MuiDialogActions-root {
    padding: 12px 20px 20px;
    gap: 10px;
  }
`

const Transition = forwardRef((props, ref) => (
  <Slide direction="up" ref={ref} {...props} />
))

const Dialog = ({ onSubmit, children, ...props }) => {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"))

  return (
    <StyledDialog
      fullScreen={fullScreen}
      TransitionComponent={Transition}
      {...props}
    >
      <Form onSubmit={onSubmit} autoComplete="off">
        {children}
      </Form>
    </StyledDialog>
  )
}

export default Dialog
