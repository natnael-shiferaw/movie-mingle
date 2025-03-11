"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import { Film, Heart, Search, Menu, X, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTheme } from "next-themes"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  // After mounting, we can safely show the UI that depends on the theme
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery("")
      setIsMenuOpen(false)
    }
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl">
              <Film className="h-6 w-6" />
              <span>MovieMingle</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className={`text-sm font-medium ${router.pathname === "/" ? "text-primary" : "text-foreground/60 hover:text-foreground"}`}
            >
              Home
            </Link>
            <Link
              href="/favorites"
              className={`text-sm font-medium ${router.pathname === "/favorites" ? "text-primary" : "text-foreground/60 hover:text-foreground"}`}
            >
              Favorites
            </Link>
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="search"
                placeholder="Search movies..."
                className="w-[200px] pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            </form>
            <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
              {mounted && theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-4 md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
              {mounted && theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="search"
                placeholder="Search movies..."
                className="w-full pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            </form>
            <nav className="flex flex-col gap-2">
              <Link
                href="/"
                className={`px-4 py-2 rounded-md ${router.pathname === "/" ? "bg-primary/10 text-primary" : "hover:bg-muted"}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/favorites"
                className={`px-4 py-2 rounded-md ${router.pathname === "/favorites" ? "bg-primary/10 text-primary" : "hover:bg-muted"}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  <span>Favorites</span>
                </div>
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}

