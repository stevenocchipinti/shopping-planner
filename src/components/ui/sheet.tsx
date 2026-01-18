import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface SheetContextValue {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const SheetContext = React.createContext<SheetContextValue | null>(null)

function useSheetContext() {
  const context = React.useContext(SheetContext)
  if (!context) {
    throw new Error("Sheet components must be used within a Sheet")
  }
  return context
}

interface SheetProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

function Sheet({ open = false, onOpenChange, children }: SheetProps) {
  return (
    <SheetContext.Provider value={{ open, onOpenChange: onOpenChange ?? (() => {}) }}>
      {children}
    </SheetContext.Provider>
  )
}

function SheetTrigger({ 
  children, 
  asChild,
  ...props 
}: { 
  children: React.ReactNode
  asChild?: boolean 
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { onOpenChange } = useSheetContext()
  
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<{ onClick?: () => void }>, {
      onClick: () => onOpenChange(true),
    })
  }
  
  return (
    <button onClick={() => onOpenChange(true)} {...props}>
      {children}
    </button>
  )
}

function SheetOverlay({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { open, onOpenChange } = useSheetContext()
  
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 bg-black/80",
        open ? "animate-in fade-in-0" : "animate-out fade-out-0",
        className
      )}
      onClick={() => onOpenChange(false)}
      {...props}
    />
  )
}

interface SheetContentProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: "left" | "right" | "top" | "bottom"
}

const SheetContent = React.forwardRef<HTMLDivElement, SheetContentProps>(
  ({ className, children, side = "left", ...props }, ref) => {
    const { open, onOpenChange } = useSheetContext()
    const [shouldRender, setShouldRender] = React.useState(false)
    const [isAnimating, setIsAnimating] = React.useState(false)
    
    // Handle mounting and unmounting with animation
    React.useEffect(() => {
      let openTimer: ReturnType<typeof setTimeout>
      let closeTimer: ReturnType<typeof setTimeout>
      
      if (open) {
        setShouldRender(true)
        // Use setTimeout to ensure DOM has painted the initial state
        openTimer = setTimeout(() => {
          setIsAnimating(true)
        }, 20)
      } else {
        setIsAnimating(false)
        // Wait for exit animation to complete before unmounting
        closeTimer = setTimeout(() => {
          setShouldRender(false)
        }, 300)
      }
      
      return () => {
        clearTimeout(openTimer)
        clearTimeout(closeTimer)
      }
    }, [open])
    
    // Handle escape key and body scroll
    React.useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") onOpenChange(false)
      }
      
      if (open) {
        document.addEventListener("keydown", handleEscape)
        document.body.style.overflow = "hidden"
      }
      
      return () => {
        document.removeEventListener("keydown", handleEscape)
        document.body.style.overflow = ""
      }
    }, [open, onOpenChange])
    
    if (!shouldRender) return null
    
    const sideStyles = {
      left: "inset-y-0 left-0 h-full w-3/4 max-w-xs border-r",
      right: "inset-y-0 right-0 h-full w-3/4 max-w-xs border-l",
      top: "inset-x-0 top-0 w-full border-b",
      bottom: "inset-x-0 bottom-0 w-full border-t",
    }
    
    const transformClasses = {
      left: isAnimating ? "translate-x-0" : "-translate-x-full",
      right: isAnimating ? "translate-x-0" : "translate-x-full",
      top: isAnimating ? "translate-y-0" : "-translate-y-full",
      bottom: isAnimating ? "translate-y-0" : "translate-y-full",
    }
    
    return (
      <>
        <div
          className={cn(
            "fixed inset-0 z-50 bg-black/80 transition-opacity duration-300",
            isAnimating ? "opacity-100" : "opacity-0"
          )}
          onClick={() => onOpenChange(false)}
        />
        <div
          ref={ref}
          className={cn(
            "fixed z-50 gap-4 bg-background p-6 shadow-lg transition-transform duration-300 ease-in-out",
            sideStyles[side],
            transformClasses[side],
            className
          )}
          onClick={(e) => e.stopPropagation()}
          {...props}
        >
          {children}
          <button
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        </div>
      </>
    )
  }
)
SheetContent.displayName = "SheetContent"

const SheetHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-col space-y-2 text-left", className)}
    {...props}
  />
)
SheetHeader.displayName = "SheetHeader"

const SheetTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn("text-lg font-semibold text-foreground", className)}
    {...props}
  />
))
SheetTitle.displayName = "SheetTitle"

const SheetDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
SheetDescription.displayName = "SheetDescription"

export {
  Sheet,
  SheetTrigger,
  SheetOverlay,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
}
