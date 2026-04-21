import React from "react"
import { flushSync } from "react-dom"
import { useHref, useLocation, useNavigate } from "react-router-dom"

export type NavigationDirection = "list" | "planner"

export interface TransitionNavigationOptions {
  direction?: NavigationDirection
  replace?: boolean
}

const shouldHandleLinkClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
  return (
    event.button === 0 &&
    (!event.currentTarget.target || event.currentTarget.target === "_self") &&
    !(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)
  )
}

export const useNavigateWithTransition = () => {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  return React.useCallback(
    (to: string, options?: TransitionNavigationOptions) => {
      if (pathname === to) return

      const replace = options?.replace
      const direction = options?.direction
      const navigateOptions = { replace }

      if (typeof document.startViewTransition !== "function") {
        navigate(to, navigateOptions)
        return
      }

      const root = document.documentElement

      if (direction) {
        root.dataset.navDirection = direction
      }

      const transition = document.startViewTransition(() => {
        flushSync(() => {
          navigate(to, navigateOptions)
        })
      })

      transition.finished.finally(() => {
        delete root.dataset.navDirection
      })
    },
    [navigate, pathname]
  )
}

interface TransitionLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode
  className?: string
  direction?: NavigationDirection
  replace?: boolean
  to: string
}

export const TransitionLink = ({
  children,
  className,
  direction,
  onClick,
  replace,
  to,
  ...rest
}: TransitionLinkProps) => {
  const href = useHref(to)
  const navigateWithTransition = useNavigateWithTransition()

  return (
    <a
      {...rest}
      className={className}
      href={href}
      onClick={event => {
        onClick?.(event)

        if (event.defaultPrevented || !shouldHandleLinkClick(event)) return

        event.preventDefault()
        navigateWithTransition(to, { direction, replace })
      }}
    >
      {children}
    </a>
  )
}
