# Movie Mingle: A Next.js Movie Recommendation App

## Overview
Movie Mingle is a dynamic movie recommendation application built using Next.js. It allows users to explore trending movies, receive personalized recommendations, and save their favorite movies for easy access. Designed for a seamless and engaging experience, the app integrates third-party APIs to fetch real-time data and provides a highly interactive user interface.

## Features
### ✅ API Integration
- Fetches trending and recommended movies using a public API.
- Implements error handling and loading states for better UX.

### ✅ Dynamic Routing
- Uses Next.js dynamic routing to create dedicated movie detail pages.
- Ensures fast navigation and optimized rendering.

### ✅ Save Favorite Movies
- Allows users to save favorite movies locally or via an API.
- Features a dedicated favorites section for easy management.

### ✅ Responsive & Interactive UI
- Designed with Tailwind CSS for a modern and scalable layout.
- Provides smooth animations, hover effects, and media queries for responsiveness.

## Technologies Used
- **Next.js** – Server-side rendering and dynamic routing.
- **TypeScript** – Ensures type safety and maintainability.
- **Tailwind CSS** – Styles UI components efficiently.
- **React Hooks** – Manages state and component logic.
- **Local Storage / API** – Stores user preferences and favorite movies.

## Implementation Process
### 🚀 Project Setup & API Integration
- Initialize Next.js with TypeScript.
- Integrate a public movie API to fetch data dynamically.

### 🛠 Feature Development
- Implement dynamic routing for movie detail pages.
- Develop a system for saving and retrieving favorite movies.

### 🎨 UI Enhancements & Bug Fixes
- Style the application using Tailwind CSS.
- Optimize performance and fix rendering issues.

## Deployment
- **Platform**: Hosted on [Vercel](https://movie-mingle-pi.vercel.app/)  for public access.

## Evaluation Criteria
### ✔ Functionality
- Successfully fetches and displays trending and recommended movies.
- Implements dynamic routing for detailed movie pages.
- Allows users to save and manage favorite movies.

### ✔ Code Quality
- Uses Next.js efficiently with modular and reusable components.
- Maintains clean, logical, and well-documented code.

### ✔ User Experience
- Visually appealing and fully responsive.
- Smooth navigation and optimized performance.

## Getting Started
### Prerequisites
- Node.js installed
- A public movie API key

### Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/movie-mingle.git
   ```
2. Navigate to the project folder:
   ```sh
   cd movie-mingle
   ```
3. Install dependencies:
   ```sh
   npm install
   ```
4. Create an `.env.local` file and add your API key:
   ```sh
   NEXT_PUBLIC_MOVIE_API_KEY=your_api_key_here
   ```
5. Run the development server:
   ```sh
   npm run dev
   ```
6. Open [http://localhost:3000](http://localhost:3000) in your browser.

---
Enjoy exploring movies with Movie Mingle! 🍿
