import { Info, Github, ExternalLink } from "lucide-react"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"

interface AboutDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AboutDialog({ open, onOpenChange }: AboutDialogProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="sm:max-w-md mx-auto">
        <DrawerHeader>
          <DrawerTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            About Shopping Planner
          </DrawerTitle>
        </DrawerHeader>

        <div className="space-y-4 px-4 pb-4">
          <p className="text-sm text-muted-foreground">
            A simple, collaborative shopping list and meal planning app. Share
            your list with family members and shop together in real-time.
          </p>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Features</h3>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Real-time collaborative shopping lists</li>
              <li>Weekly meal planning</li>
              <li>Recipe management with ingredients</li>
              <li>Item categorization by section</li>
              <li>Works offline (PWA)</li>
            </ul>
          </div>

          <div className="pt-4 border-t">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Version</span>
              <span className="font-mono">2.0.0</span>
            </div>
          </div>

          <div className="pt-2 text-xs text-muted-foreground">
            <p>
              Custom emoji icons by{" "}
              <a
                href="https://openmoji.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-foreground"
              >
                OpenMoji
              </a>{" "}
              – the open-source emoji and icon project. License:{" "}
              <a
                href="https://creativecommons.org/licenses/by-sa/4.0/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-foreground"
              >
                CC BY-SA 4.0
              </a>
            </p>
          </div>

          <div className="flex gap-2">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
            >
              <Github className="h-4 w-4" />
              GitHub
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
