import { Loader2 } from "lucide-react"

// Displays a centered loading spinner
export default function LoadingState() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-primary" /> {/* Spinning loader icon */}
        <p className="text-muted-foreground">Loading...</p> {/* Loading message */}
      </div>
    </div>
  )
}

