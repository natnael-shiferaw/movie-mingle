import Link from "next/link"
import { Film, Github } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl">
              <Film className="h-6 w-6" />
              <span>MovieMingle</span>
            </Link>
            <p className="text-sm text-muted-foreground text-center md:text-left">
              Find your next favorite movie with personalized recommendations
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end gap-2">
            <div className="flex items-center gap-4">
              <Link
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground"
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
            </div>
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} MovieMingle. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground">Powered by TMDB API</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

