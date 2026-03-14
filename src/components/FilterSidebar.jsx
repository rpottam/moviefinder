import React from 'react';
import { useMovies } from '../context/MovieContext';
import { X, RotateCcw } from 'lucide-react';

const LANGUAGES = [
  { code: '', label: 'All Languages' },
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'Hindi' },
  { code: 'es', label: 'Spanish' },
  { code: 'fr', label: 'French' },
  { code: 'ja', label: 'Japanese' },
  { code: 'ko', label: 'Korean' },
  { code: 'de', label: 'German' },
  { code: 'it', label: 'Italian' },
  { code: 'pt', label: 'Portuguese' },
  { code: 'ru', label: 'Russian' },
  { code: 'zh', label: 'Chinese' },
  { code: 'te', label: 'Telugu' },
  { code: 'ta', label: 'Tamil' },
  { code: 'ml', label: 'Malayalam' },
  { code: 'kn', label: 'Kannada' },
];

const FilterSidebar = ({ isOpen, closeSidebar }) => {
  const { 
    genres, 
    selectedGenres, 
    toggleGenre,
    selectedLanguage,
    setSelectedLanguage,
    minYear,
    setMinYear,
    contentType,
    searchQuery,
    clearFilters
  } = useMovies();

  const [langSearch, setLangSearch] = React.useState('');
  const [isLangExpanded, setIsLangExpanded] = React.useState(false);

  const filteredLanguages = LANGUAGES.filter(l => 
    l.label.toLowerCase().includes(langSearch.toLowerCase())
  );

  const hasActiveFilters = selectedGenres.length > 0 || selectedLanguage !== '' || minYear !== '' || contentType !== 'trending' || searchQuery !== '';

  const currentYear = new Date().getFullYear();

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
        w-80 bg-[#09090b] md:bg-transparent border-r border-white/5 
        transform transition-transform duration-500 ease-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        flex flex-col overflow-y-auto no-scrollbar p-8 gap-12
      `}>
        <div className="flex items-center justify-between md:hidden pb-4 border-b border-white/10">
          <h2 className="text-xl font-black text-white tracking-tight">FILTERS</h2>
          <button onClick={closeSidebar} className="p-2 text-textSecondary hover:text-white">
            <X size={24} />
          </button>
        </div>

        {/* Language Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-textSecondary opacity-50">
              Language
            </h3>
            {selectedLanguage && (
               <button 
                 onClick={() => setSelectedLanguage('')}
                 className="text-[10px] font-bold text-primary hover:text-white transition-colors"
               >
                 CLEAR
               </button>
            )}
          </div>
          
          <div className="relative group">
            <input 
              type="text"
              placeholder="Search language..."
              value={langSearch}
              onChange={(e) => {
                setLangSearch(e.target.value);
                setIsLangExpanded(true);
              }}
              onFocus={() => setIsLangExpanded(true)}
              className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
            />
          </div>

          <div className="flex flex-wrap gap-2 max-h-[160px] overflow-y-auto no-scrollbar pr-2">
            {(langSearch || isLangExpanded ? filteredLanguages : LANGUAGES.slice(0, 8)).map((lang) => (
              <button
                key={lang.code}
                onClick={() => setSelectedLanguage(lang.code)}
                className={`
                  px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 border
                  ${selectedLanguage === lang.code 
                    ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' 
                    : 'bg-white/[0.03] border-white/5 text-textSecondary hover:bg-white/10 hover:text-textPrimary'}
                `}
              >
                {lang.label}
              </button>
            ))}
            {!langSearch && !isLangExpanded && LANGUAGES.length > 8 && (
              <button 
                onClick={() => setIsLangExpanded(true)}
                className="text-[10px] font-bold text-textSecondary/40 hover:text-primary transition-colors px-2"
              >
                + ALL
              </button>
            )}
          </div>
        </div>

        {/* Year Slider Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-textSecondary opacity-50">
              Release Year
            </h3>
            {minYear && (
               <button 
                 onClick={() => setMinYear('')}
                 className="text-[10px] font-bold text-primary hover:text-white transition-colors"
               >
                 RESET
               </button>
            )}
          </div>
          
          <div className="px-2">
            <div className="flex justify-between text-[10px] font-bold text-textSecondary mb-4">
              <span>1950</span>
              <span className="text-white bg-primary/20 px-2 py-0.5 rounded border border-primary/30">{minYear || 'All Time'}</span>
              <span>{currentYear}</span>
            </div>
            <input 
              type="range"
              min="1950"
              max={currentYear}
              value={minYear || currentYear}
              onChange={(e) => setMinYear(e.target.value)}
              className="w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer accent-primary hover:accent-primary/80 transition-all"
            />
          </div>

          <div className="grid grid-cols-4 gap-2">
            {[2024, 2010, 2000, 1990].map(y => (
              <button
                key={y}
                onClick={() => setMinYear(y.toString())}
                className={`py-1.5 rounded-lg text-[10px] font-black transition-all border ${minYear === y.toString() ? 'bg-primary border-primary text-white' : 'bg-white/[0.02] border-white/5 text-textSecondary hover:bg-white/5'}`}
              >
                {y}s
              </button>
            ))}
          </div>
        </div>

        {/* Genres Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-textSecondary opacity-50">
              Categories
            </h3>
            {selectedGenres.length > 0 && (
               <button 
                 onClick={() => clearFilters()}
                 className="text-[10px] font-bold text-primary hover:text-white transition-colors"
               >
                 {selectedGenres.length} SELECTED
               </button>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            {genres.map(genre => {
              const isSelected = selectedGenres.includes(genre.id);
              return (
                <button
                  key={genre.id}
                  onClick={() => toggleGenre(genre.id)}
                  className={`
                    px-3 py-2.5 rounded-xl text-[11px] font-bold text-left transition-all duration-300 border truncate
                    ${isSelected 
                      ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20 scale-[1.02]' 
                      : 'bg-[#16161a] border-white/5 text-textSecondary hover:bg-[#1c1c22] hover:text-white'}
                  `}
                >
                  {genre.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Reset */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="mt-8 flex items-center justify-center gap-2 w-full py-4 bg-white/5 border border-dashed border-white/10 rounded-2xl text-[11px] font-black uppercase tracking-widest text-textSecondary hover:text-white hover:bg-white/10 hover:border-primary/50 transition-all duration-300"
          >
            <RotateCcw size={14} strokeWidth={3} />
            <span>Reset Discovery</span>
          </button>
        )}
      </aside>
    </>

  );
};

export default FilterSidebar;
