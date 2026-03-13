import React from 'react';
import { useMovies } from '../context/MovieContext';
import { X, RotateCcw } from 'lucide-react';

const LANGUAGES = [
  { code: '', label: 'Any Language' },
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'Hindi' },
  { code: 'es', label: 'Spanish' },
  { code: 'fr', label: 'French' },
  { code: 'ja', label: 'Japanese' },
  { code: 'ko', label: 'Korean' },
];

const FilterSidebar = ({ isOpen, closeSidebar }) => {
  const { 
    genres, 
    selectedGenres, 
    toggleGenre,
    selectedLanguage,
    setSelectedLanguage,
    contentType,
    searchQuery,
    clearFilters
  } = useMovies();


  const hasActiveFilters = selectedGenres.length > 0 || selectedLanguage !== '' || contentType !== 'trending' || searchQuery !== '';


  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={closeSidebar}
        />
      )}
      
      {/* Sidebar Content */}
      <aside className={`
        fixed md:sticky top-0 left-0 h-screen md:h-[calc(100vh-73px)] z-50 md:z-10
        w-72 bg-background md:bg-transparent border-r border-white/10 
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        flex flex-col overflow-y-auto overflow-x-hidden p-6 gap-8
      `}>
        <div className="flex items-center justify-between md:hidden pb-4 border-b border-white/10">
          <h2 className="text-lg font-bold text-white">Filters</h2>
          <button onClick={closeSidebar} className="text-textSecondary hover:text-white">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Language Filter */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-textSecondary mb-4">
            Language
          </h3>
          <div className="space-y-2">
            {LANGUAGES.map((lang) => (
              <label key={lang.code} className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="radio" 
                  name="language"
                  className="hidden"
                  checked={selectedLanguage === lang.code}
                  onChange={() => setSelectedLanguage(lang.code)}
                />
                <div className={`
                  w-5 h-5 rounded-full border flex items-center justify-center transition-colors
                  ${selectedLanguage === lang.code 
                    ? 'border-primary bg-primary' 
                    : 'border-white/20 group-hover:border-white/50 bg-white/5'}
                `}>
                  {selectedLanguage === lang.code && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
                <span className={`text-sm transition-colors ${selectedLanguage === lang.code ? 'text-white font-medium' : 'text-textSecondary group-hover:text-textPrimary'}`}>
                  {lang.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Categories Filter */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-textSecondary mb-4 flex justify-between items-center">
            <span>Genres</span>
            {selectedGenres.length > 0 && (
              <span className="text-xs font-normal text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                {selectedGenres.length} selected
              </span>
            )}
          </h3>
          <div className="flex flex-wrap gap-2">
            {genres.map(genre => {
              const isSelected = selectedGenres.includes(genre.id);
              return (
                <button
                  key={genre.id}
                  onClick={() => toggleGenre(genre.id)}
                  className={`
                    px-3 py-1.5 rounded-lg text-sm transition-all duration-300
                    ${isSelected 
                      ? 'bg-primary text-white shadow-lg shadow-primary/20 border-transparent' 
                      : 'bg-white/5 text-textSecondary border border-white/10 hover:bg-white/10 hover:text-white'}
                  `}
                >
                  {genre.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="mt-auto flex items-center justify-center gap-2 w-full py-3 glass-button-secondary text-sm border-primary/30 text-primary hover:bg-primary/5"
          >
            <RotateCcw size={16} />
            <span>Reset All Filters</span>
          </button>
        )}


      </aside>
    </>
  );
};

export default FilterSidebar;
