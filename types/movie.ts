export interface Movie {
  id: string
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
}

export interface MovieDetails extends Movie {
  runtime: number
  status: string
  budget: number
  revenue: number
  original_language: string
  genres: {
    id: number
    name: string
  }[]
  production_companies?: {
    id: number
    name: string
  }[]
  credits?: {
    cast: {
      id: number
      name: string
      character: string
      profile_path: string | null
    }[]
  }
}

