# PickFlicks

A modern, responsive web application for discovering movies, built with React and Tailwind CSS featuring a glassmorphism design.

## Features
- **Real-time Search & Discovery**: Find movies instantly.
- **Advanced Filtering**: Filter by language and genres.
- **Detailed View Modal**: View synopsis, trailers, and cast.
- **OTT Availability (USA)**: See where movies are streaming right now.
- **Dark Mode & Glassmorphism**: Premium frosted-glass aesthetic.

## Setup Instructions

1. **Install Dependencies**
   \`\`\`bash
   npm install
   \`\`\`

2. **API Keys Configuration**
   This application requires API keys from The Movie Database (TMDb) and Watchmode.
   
   - Get a TMDb API key: [https://developer.themoviedb.org/docs/getting-started](https://developer.themoviedb.org/docs/getting-started)
   - Get a Watchmode API key: [https://api.watchmode.com/](https://api.watchmode.com/)

   Create a \`.env\` file in the root directory and add your keys:
   \`\`\`env
   VITE_TMDB_API_KEY=your_tmdb_api_key_here
   VITE_WATCHMODE_API_KEY=your_watchmode_api_key_here
   \`\`\`

3. **Start the Development Server**
   \`\`\`bash
   npm run dev
   \`\`\`

## Technologies Used
- React 18, Vite
- Tailwind CSS v3
- Context API for state management
- TMDb API & Watchmode API
