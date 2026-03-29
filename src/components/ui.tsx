import React, {
  ButtonHTMLAttributes,
  FormEvent,
  InputHTMLAttributes,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { createPortal } from "react-dom"

import {
  drawerOverlayDismiss,
  button,
  drawerPanel,
  drawerViewport,
  dialogForm,
  dialogPanel,
  dialogViewport,
  iconButton,
  input,
  inputAdornment,
  inputReadOnly,
  inputShell,
  overlay,
  popover,
  spinner,
  switchInput,
  switchRoot,
  switchThumb,
  switchTrack,
} from "./ui.css"

const canUseDom = typeof window !== "undefined"

const useBodyLock = (active: boolean) => {
  useEffect(() => {
    if (!canUseDom || !active) return

    const original = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = original
    }
  }, [active])
}

const useEscape = (active: boolean, onClose: () => void) => {
  useEffect(() => {
    if (!active || !canUseDom) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [active, onClose])
}

const usePortalRoot = () => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return mounted && canUseDom ? document.body : null
}

type ButtonVariants = Parameters<typeof button>[0]
type IconButtonVariants = Parameters<typeof iconButton>[0]

const cx = (...classNames: Array<string | false | null | undefined>) =>
  classNames.filter(Boolean).join(" ")

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: NonNullable<ButtonVariants>["variant"]
  size?: NonNullable<ButtonVariants>["size"]
  fullWidth?: boolean
  children: ReactNode
}

const Button = ({
  variant,
  size,
  fullWidth,
  className,
  type = "button",
  ...props
}: ButtonProps) => (
  <button
    className={cx(button({ variant, size, fullWidth }), className)}
    type={type}
    {...props}
  />
)

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  tone?: NonNullable<IconButtonVariants>["tone"]
  children: ReactNode
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ tone, className, type = "button", ...props }, ref) => (
    <button
      className={cx(iconButton({ tone }), className)}
      ref={ref}
      type={type}
      {...props}
    />
  )
)

IconButton.displayName = "IconButton"

interface TextFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  startAdornment?: ReactNode
  endAdornment?: ReactNode
  inputRef?: React.Ref<HTMLInputElement>
  inputClassName?: string
}

const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      startAdornment,
      endAdornment,
      className,
      inputClassName,
      inputRef,
      readOnly,
      ...props
    },
    ref
  ) => {
    const mergedRef = (node: HTMLInputElement | null) => {
      if (typeof ref === "function") ref(node)
      else if (ref) ref.current = node

      if (typeof inputRef === "function") inputRef(node)
      else if (inputRef && "current" in inputRef) inputRef.current = node
    }

    return (
      <div className={cx(inputShell, className)}>
        {startAdornment ? (
          <span className={inputAdornment}>{startAdornment}</span>
        ) : null}
        <input
          className={cx(input, inputClassName, readOnly && inputReadOnly)}
          readOnly={readOnly}
          ref={mergedRef}
          {...props}
        />
        {endAdornment ? (
          <span className={inputAdornment}>{endAdornment}</span>
        ) : null}
      </div>
    )
  }
)

TextField.displayName = "TextField"

interface SpinnerProps {
  className?: string
}

const Spinner = ({ className }: SpinnerProps) => (
  <div aria-label="Loading" className={cx(spinner, className)} />
)

interface DialogProps {
  open: boolean
  onClose: () => void
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void
  children: ReactNode
}

const Dialog = ({ open, onClose, onSubmit, children }: DialogProps) => {
  const portalRoot = usePortalRoot()
  useBodyLock(open)
  useEscape(open, onClose)

  if (!open || !portalRoot) return null

  return createPortal(
    <>
      <div className={overlay} onClick={onClose} />
      <div className={dialogViewport}>
        <div className={dialogPanel} role="dialog" aria-modal="true">
          {onSubmit ? (
            <form className={dialogForm} onSubmit={onSubmit} autoComplete="off">
              {children}
            </form>
          ) : (
            <div className={dialogForm}>{children}</div>
          )}
        </div>
      </div>
    </>,
    portalRoot
  )
}

interface DrawerProps {
  open: boolean
  onClose: () => void
  children: ReactNode
  className?: string
  panelClassName?: string
}

const Drawer = ({ open, onClose, children, className, panelClassName }: DrawerProps) => {
  const portalRoot = usePortalRoot()
  useBodyLock(open)
  useEscape(open, onClose)

  if (!open || !portalRoot) return null

  return createPortal(
    <>
      <div className={overlay} onClick={onClose} />
      <div className={cx(drawerViewport, className)}>
        <div className={cx(drawerPanel, panelClassName)}>{children}</div>
        <button
          className={drawerOverlayDismiss}
          type="button"
          aria-label="Close menu"
          onClick={onClose}
        />
      </div>
    </>,
    portalRoot
  )
}

interface PopoverProps {
  open: boolean
  anchorEl: HTMLElement | null
  onClose: () => void
  children: ReactNode
}

const Popover = ({ open, anchorEl, onClose, children }: PopoverProps) => {
  const portalRoot = usePortalRoot()
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const contentRef = useRef<HTMLDivElement | null>(null)

  useEscape(open, onClose)

  useEffect(() => {
    if (!open || !anchorEl || !canUseDom) return

    const updatePosition = () => {
      const rect = anchorEl.getBoundingClientRect()
      const maxLeft = Math.max(
        12,
        window.innerWidth - Math.min(360, window.innerWidth - 24) - 12
      )
      setPosition({
        top: Math.min(window.innerHeight - 24, rect.bottom + 8),
        left: Math.min(maxLeft, Math.max(12, rect.left)),
      })
    }

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node | null
      if (!target) return
      if (anchorEl.contains(target)) return
      if (contentRef.current?.contains(target)) return
      onClose()
    }

    updatePosition()
    window.addEventListener("resize", updatePosition)
    window.addEventListener("scroll", updatePosition, true)
    window.addEventListener("mousedown", handlePointerDown)

    return () => {
      window.removeEventListener("resize", updatePosition)
      window.removeEventListener("scroll", updatePosition, true)
      window.removeEventListener("mousedown", handlePointerDown)
    }
  }, [anchorEl, onClose, open])

  const style = useMemo(
    () => ({ top: position.top, left: position.left }),
    [position.left, position.top]
  )

  if (!open || !anchorEl || !portalRoot) return null

  return createPortal(
    <div className={popover} ref={contentRef} style={style}>
      {children}
    </div>,
    portalRoot
  )
}

interface SwitchProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string
}

const Switch = ({ className, ...props }: SwitchProps) => (
  <label className={cx(switchRoot, className)}>
    <input className={switchInput} type="checkbox" {...props} />
    <span className={switchTrack} />
    <span className={switchThumb} />
  </label>
)

export {
  Button,
  Dialog,
  Drawer,
  IconButton,
  Popover,
  Spinner,
  Switch,
  TextField,
  cx,
}
export { button, dialogForm, iconButton }
