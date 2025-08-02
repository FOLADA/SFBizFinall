'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, TrendingUp, MapPin, Building2 } from 'lucide-react';
import { debounce } from '@/lib/utils';
import { searchApi, SearchSuggestion } from '@/lib/api';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  placeholder?: string;
  className?: string;
  suggestions?: SearchSuggestion[];
  isLoading?: boolean;
}

export default function SearchBar({
  value,
  onChange,
  onSearch,
  placeholder = "Search businesses, categories, locations...",
  className = "",
  suggestions = [],
  isLoading = false,
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Debounced search for suggestions
  const debouncedSearch = debounce(async (query: string) => {
    if (query.trim().length < 2) return;
    
    try {
      const response = await searchApi.getSearchSuggestions(query);
      // Handle suggestions here if needed
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
    }
  }, 300);

  useEffect(() => {
    if (value) {
      debouncedSearch(value);
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setShowSuggestions(newValue.length > 0);
  };

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    setShowSuggestions(false);
    onSearch();
  };

  const handleClear = () => {
    onChange('');
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch();
      setShowSuggestions(false);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      inputRef.current?.blur();
    }
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'business':
        return <Building2 className="w-4 h-4" />;
      case 'category':
        return <TrendingUp className="w-4 h-4" />;
      case 'location':
        return <MapPin className="w-4 h-4" />;
      default:
        return <Search className="w-4 h-4" />;
    }
  };

  return (
    <div className={`relative w-full ${className}`}>
      {/* Search Input */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="relative"
      >
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
          
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={handleInputChange}
            onFocus={() => {
              setIsFocused(true);
              setShowSuggestions(value.length > 0);
            }}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full pl-12 pr-12 py-4 bg-neutral-900/80 border border-neutral-800 rounded-2xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm hover:bg-neutral-900/90"
          />
          
          {value && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              onClick={handleClear}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-neutral-800 transition-colors"
            >
              <X className="w-4 h-4 text-neutral-400" />
            </motion.button>
          )}
        </div>

        {/* Loading Indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute right-4 top-1/2 transform -translate-y-1/2"
          >
            <div className="w-5 h-5 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
          </motion.div>
        )}
      </motion.div>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && (suggestions.length > 0 || value.length > 0) && (
          <motion.div
            ref={suggestionsRef}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-neutral-900/95 backdrop-blur-xl border border-neutral-800 rounded-2xl shadow-2xl z-50 max-h-80 overflow-y-auto"
          >
            {/* Search for current query */}
            {value.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="p-3 border-b border-neutral-800"
              >
                <button
                  onClick={() => handleSuggestionClick(value)}
                  className="flex items-center w-full p-2 rounded-lg hover:bg-neutral-800 transition-colors text-left"
                >
                  <Search className="w-4 h-4 mr-3 text-rose-500" />
                  <span className="text-white">Search for "{value}"</span>
                </button>
              </motion.div>
            )}

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div className="p-2">
                {suggestions.map((suggestion, index) => (
                  <motion.button
                    key={suggestion.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleSuggestionClick(suggestion.text)}
                    className="flex items-center w-full p-3 rounded-lg hover:bg-neutral-800 transition-colors text-left group"
                  >
                    <div className="mr-3 text-neutral-400 group-hover:text-rose-500 transition-colors">
                      {getSuggestionIcon(suggestion.type)}
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-medium">{suggestion.text}</div>
                      {suggestion.count && (
                        <div className="text-sm text-neutral-500">
                          {suggestion.count} results
                        </div>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            )}

            {/* No suggestions */}
            {suggestions.length === 0 && value.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 text-center text-neutral-500"
              >
                Start typing to search...
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 