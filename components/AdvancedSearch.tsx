'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchFilters, SearchResult, SearchResponse } from '@/lib/api';
import { searchApi } from '@/lib/api';
import { updateSearchParams, parseSearchParams } from '@/lib/utils';
import { Filter, X, ChevronDown, ChevronUp, MapPin, Star, Clock, Users } from 'lucide-react';
import SearchBar from './SearchBar';
import FilterPanel from './FilterPanel';
import SearchResults from './SearchResults';

interface AdvancedSearchProps {
  initialFilters?: SearchFilters;
  className?: string;
}

export default function AdvancedSearch({ 
  initialFilters,
  className = "" 
}: AdvancedSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>(initialFilters || {
    page: 1,
    limit: 12,
  });
  
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchResponse, setSearchResponse] = useState<SearchResponse | null>(null);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Initialize filters from URL on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlFilters = parseSearchParams();
      setFilters(prev => ({ ...prev, ...urlFilters }));
    }
  }, []);

  // Update URL when filters change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      updateSearchParams(filters);
    }
  }, [filters]);

  // Perform search when filters change
  const performSearch = useCallback(async (searchFilters: SearchFilters, append = false) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await searchApi.searchBusinesses(searchFilters);
      
      if (append) {
        setResults(prev => [...prev, ...response.businesses]);
      } else {
        setResults(response.businesses);
      }
      
      setSearchResponse(response);
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to search businesses. Please try again.');
      setResults([]);
      setSearchResponse(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(filters);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [filters, performSearch]);

  const handleFiltersChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
  };

  const handleSearch = () => {
    performSearch(filters);
  };

  const handleLoadMore = async () => {
    if (isLoadingMore || !searchResponse) return;

    const nextPage = (filters.page || 1) + 1;
    const newFilters = { ...filters, page: nextPage };

    try {
      setIsLoadingMore(true);
      const response = await searchApi.searchBusinesses(newFilters);
      
      setResults(prev => [...prev, ...response.businesses]);
      setSearchResponse(response);
      setFilters(newFilters);
    } catch (err) {
      console.error('Load more error:', err);
      setError('Failed to load more results.');
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleResetFilters = () => {
    const resetFilters: SearchFilters = {
      page: 1,
      limit: 12,
    };
    setFilters(resetFilters);
  };

  const handleSuggestionSelect = (suggestion: string) => {
    setFilters(prev => ({
      ...prev,
      q: suggestion,
      page: 1,
    }));
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.category?.length) count += filters.category.length;
    if (filters.location?.length) count += filters.location.length;
    if (filters.minRating || filters.maxRating) count += 1;
    if (filters.sortBy) count += 1;
    return count;
  };

  const hasActiveFilters = getActiveFiltersCount() > 0;

  // Super simple quick filters for kids
  const simpleFilters = [
    { label: '🍕 Food', category: 'restaurant', color: 'bg-orange-500' },
    { label: '🛠️ Services', category: 'service', color: 'bg-blue-500' },
    { label: '🛍️ Shopping', category: 'retail', color: 'bg-purple-500' },
    { label: '🏥 Health', category: 'healthcare', color: 'bg-green-500' },
    { label: '🎓 Education', category: 'education', color: 'bg-indigo-500' },
    { label: '🎨 Arts', category: 'arts', color: 'bg-pink-500' },
  ];

  const handleSimpleFilter = (category: string) => {
    setFilters(prev => ({
      ...prev,
      category: [category],
      page: 1,
    }));
  };

  return (
    <div className={`max-w-7xl mx-auto px-4 lg:px-8 ${className}`}>
      {/* Super Simple Search Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        {/* Big, Friendly Search Bar */}
        <div className="mb-8">
          <SearchBar
            value={filters.q || ''}
            onChange={(value) => setFilters(prev => ({ ...prev, q: value, page: 1 }))}
            onSearch={handleSearch}
            suggestions={suggestions}
            isLoading={isLoading}
            className="max-w-4xl mx-auto"
            placeholder="What are you looking for?"
          />
        </div>

        {/* Simple Filter Toggle */}
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-4">
            {/* Mobile Filter Toggle */}
            {isMobile && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
                className="flex items-center gap-3 px-6 py-3 bg-neutral-900/80 backdrop-blur-xl border-2 border-neutral-800 rounded-xl hover:bg-neutral-800 transition-all duration-300"
                aria-label="More options"
              >
                <Filter className="w-5 h-5 text-rose-500" />
                <span className="text-white font-medium">More Options</span>
                {hasActiveFilters && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="bg-rose-500 text-white text-xs px-2 py-1 rounded-full"
                  >
                    {getActiveFiltersCount()}
                  </motion.div>
                )}
                {isFilterPanelOpen ? (
                  <ChevronUp className="w-5 h-5 text-neutral-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-neutral-400" />
                )}
              </motion.button>
            )}

            {/* Clear All Button */}
            {hasActiveFilters && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleResetFilters}
                className="flex items-center gap-2 px-4 py-3 text-neutral-400 hover:text-white transition-colors border border-neutral-700 rounded-xl hover:border-neutral-600"
              >
                <X className="w-4 h-4" />
                <span className="text-sm">Start Over</span>
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filter Panel - Desktop Sidebar */}
        {!isMobile && (
          <aside className="lg:col-span-1">
            <div className="sticky top-8">
              <FilterPanel
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onReset={handleResetFilters}
                isOpen={true}
                onToggle={() => {}}
              />
            </div>
          </aside>
        )}

        {/* Mobile Filter Panel */}
        {isMobile && (
          <AnimatePresence>
            {isFilterPanelOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="lg:hidden"
              >
                <FilterPanel
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                  onReset={handleResetFilters}
                  isOpen={isFilterPanelOpen}
                  onToggle={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Search Results */}
        <main className={`${isMobile ? 'col-span-1' : 'lg:col-span-3'}`}>
          {/* Simple Search Status */}
          {searchResponse && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-neutral-900/60 backdrop-blur-xl border border-neutral-800 rounded-xl text-center"
            >
              <div className="text-white font-medium text-lg">
                Found {searchResponse.pagination.total} businesses! 🎉
              </div>
              {searchResponse.pagination.pages > 1 && (
                <div className="text-neutral-400 text-sm mt-1">
                  Page {searchResponse.pagination.page} of {searchResponse.pagination.pages}
                </div>
              )}
            </motion.div>
          )}

          {/* Error Display */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-xl text-red-400 text-center"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <SearchResults
              results={results}
              isLoading={isLoading}
              totalResults={searchResponse?.pagination.total || 0}
              currentPage={searchResponse?.pagination.page || 1}
              totalPages={searchResponse?.pagination.pages || 1}
              onLoadMore={handleLoadMore}
              hasMore={!!searchResponse && searchResponse.pagination.page < searchResponse.pagination.pages}
            />
          </motion.div>
        </main>
      </div>
    </div>
  );
} 