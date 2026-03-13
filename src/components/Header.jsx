import React, { useState } from 'react';
import { useMovies } from '../context/MovieContext';
import { useAuth } from '../context/AuthContext';
import { LogOut, LogIn } from 'lucide-react';

const Header = ({ toggleSidebar, onAuthOpen }) => {
  const { searchQuery, setSearchQuery } = useMovies();
  const { user, logout } = useAuth();
  const [localSearch, setLocalSearch] = useState(searchQuery);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(localSearch);
  };

  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-white/10 px-4 md:px-8 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {/* Mobile Sidebar Toggle */}
        <button 
          className="md:hidden text-textPrimary hover:text-primary transition-colors focus:outline-none"
          onClick={toggleSidebar}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        <div className="flex gap-2 items-center">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg shadow-primary/30">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4" />
            </svg>
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70 tracking-tight hidden sm:block">
            MovieFinder
          </h1>
        </div>
      </div>

      <div className="flex-1 max-w-xl mx-4 flex justify-end md:justify-center">
        <form onSubmit={handleSearch} className="w-full relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-textSecondary group-focus-within:text-primary transition-colors" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="search"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="glass-input w-full pl-10 pr-4 py-2.5 text-sm md:text-base bg-surface hover:bg-surfaceHover transition-colors"
            placeholder="Search movies by title..."
          />
        </form>
      </div>
      
      <div className="flex items-center gap-2 md:gap-4">
        {user ? (
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-xs text-textSecondary overflow-hidden max-w-[120px] truncate">
                {user.email}
              </p>
            </div>
            <button 
              onClick={logout}
              className="w-10 h-10 rounded-full bg-surface border border-white/10 flex items-center justify-center cursor-pointer hover:bg-red-500/20 hover:text-red-500 transition-all group"
              title="Logout"
            >
              <LogOut size={18} className="group-hover:scale-110 transition-transform" />
            </button>
          </div>
        ) : (
          <button 
            onClick={onAuthOpen}
            className="glass-button py-2 px-4 flex items-center gap-2 text-sm"
          >
            <LogIn size={16} />
            <span className="hidden sm:inline">Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
