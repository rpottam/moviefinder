import React, { useState } from 'react';
import Header from './components/Header';
import FilterSidebar from './components/FilterSidebar';
import MovieList from './components/MovieList';
import MovieDetailsModal from './components/MovieDetailsModal';
import AuthSidebar from './components/AuthSidebar';
import { MovieProvider } from './context/MovieContext';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  
  return (
    <MovieProvider>
      <div className="min-h-screen bg-background text-textPrimary selection:bg-primary selection:text-white overflow-x-hidden flex flex-col relative w-full">
        {/* Background Ambient Glow */}
        <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
        <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px] pointer-events-none" />
        
        <Header 
          toggleSidebar={toggleSidebar} 
          onAuthOpen={() => setAuthOpen(true)}
        />
        
        <main className="flex-1 flex w-full max-w-[1600px] mx-auto relative z-10">
          <FilterSidebar 
            isOpen={sidebarOpen} 
            closeSidebar={() => setSidebarOpen(false)} 
          />
          <MovieList onMovieSelect={setSelectedMovie} />
        </main>
        
        {/* Sidebars & Modals */}
        <AuthSidebar 
          isOpen={authOpen} 
          onClose={() => setAuthOpen(false)} 
        />

        {selectedMovie && (
          <MovieDetailsModal 
            movie={selectedMovie} 
            onClose={() => setSelectedMovie(null)} 
          />
        )}
      </div>
    </MovieProvider>
  );
}

export default App;

