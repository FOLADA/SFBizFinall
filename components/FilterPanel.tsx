'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  ChevronUp, 
  Filter, 
  X, 
  Star, 
  MapPin, 
  Building2,
  SortAsc,
  SortDesc,
  Clock,
  TrendingUp
} from 'lucide-react';
import { SearchFilters } from '@/lib/api';
import { getCategoryIcon, getLocationIcon } from '@/lib/utils';
import { CATEGORIES, LOCATIONS, SORT_OPTIONS } from '@/types/search';

interface FilterPanelProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onReset: () => void;
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
}

export default function FilterPanel({
  filters,
  onFiltersChange,
  onReset,
  isOpen,
  onToggle,
  className = "",
}: FilterPanelProps) {
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    locations: true,
    rating: true,
    sort: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
      page: 1, // Reset to first page when filters change
    });
  };

  const handleCategoryToggle = (category: string) => {
    const currentCategories = filters.category || [];
    const newCategories = currentCategories.includes(category)
      ? currentCategories.filter(c => c !== category)
      : [...currentCategories, category];
    
    updateFilter('category', newCategories.length > 0 ? newCategories : undefined);
  };

  const handleLocationToggle = (location: string) => {
    const currentLocations = filters.location || [];
    const newLocations = currentLocations.includes(location)
      ? currentLocations.filter(l => l !== location)
      : [...currentLocations, location];
    
    updateFilter('location', newLocations.length > 0 ? newLocations : undefined);
  };

  const handleRatingChange = (min?: number, max?: number) => {
    updateFilter('minRating', min);
    updateFilter('maxRating', max);
  };

  const handleSortChange = (sortValue: string) => {
    const [sortBy, sortOrder] = sortValue.split('-');
    updateFilter('sortBy', sortBy as SearchFilters['sortBy']);
    updateFilter('sortOrder', sortOrder as SearchFilters['sortOrder']);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.category?.length) count += filters.category.length;
    if (filters.location?.length) count += filters.location.length;
    if (filters.minRating || filters.maxRating) count += 1;
    if (filters.sortBy) count += 1;
    return count;
  };

  const getSortIcon = (sortValue: string) => {
    const [sortBy] = sortValue.split('-');
    switch (sortBy) {
      case 'rating':
        return <Star className="w-4 h-4" />;
      case 'name':
        return <Building2 className="w-4 h-4" />;
      case 'recent':
        return <Clock className="w-4 h-4" />;
      case 'distance':
        return <MapPin className="w-4 h-4" />;
      default:
        return <TrendingUp className="w-4 h-4" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-neutral-900/80 backdrop-blur-xl border border-neutral-800 rounded-2xl p-6 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Filter className="w-5 h-5 text-rose-500" />
          <h3 className="text-lg font-semibold text-white">Filters</h3>
          {getActiveFiltersCount() > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-rose-500 text-white text-xs px-2 py-1 rounded-full"
            >
              {getActiveFiltersCount()}
            </motion.div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {getActiveFiltersCount() > 0 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={onReset}
              className="text-sm text-neutral-400 hover:text-white transition-colors"
            >
              Clear all
            </motion.button>
          )}
          
          <button
            onClick={onToggle}
            className="p-2 rounded-lg hover:bg-neutral-800 transition-colors"
          >
            {isOpen ? (
              <ChevronUp className="w-5 h-5 text-neutral-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-neutral-400" />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Categories Section */}
            <FilterSection
              title="Categories"
              icon={<Building2 className="w-4 h-4" />}
              isExpanded={expandedSections.categories}
              onToggle={() => toggleSection('categories')}
            >
              <div className="grid grid-cols-2 gap-2">
                {CATEGORIES.map((category) => (
                  <motion.button
                    key={category}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleCategoryToggle(category)}
                    className={`flex items-center gap-2 p-3 rounded-lg border transition-all duration-200 ${
                      filters.category?.includes(category)
                        ? 'bg-rose-500/20 border-rose-500 text-rose-500'
                        : 'bg-neutral-800/50 border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:border-neutral-600'
                    }`}
                  >
                    <span className="text-lg">{getCategoryIcon(category)}</span>
                    <span className="text-sm font-medium truncate">{category}</span>
                  </motion.button>
                ))}
              </div>
            </FilterSection>

            {/* Locations Section */}
            <FilterSection
              title="Locations"
              icon={<MapPin className="w-4 h-4" />}
              isExpanded={expandedSections.locations}
              onToggle={() => toggleSection('locations')}
            >
              <div className="grid grid-cols-2 gap-2">
                {LOCATIONS.map((location) => (
                  <motion.button
                    key={location}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleLocationToggle(location)}
                    className={`flex items-center gap-2 p-3 rounded-lg border transition-all duration-200 ${
                      filters.location?.includes(location)
                        ? 'bg-rose-500/20 border-rose-500 text-rose-500'
                        : 'bg-neutral-800/50 border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:border-neutral-600'
                    }`}
                  >
                    <span className="text-lg">{getLocationIcon(location)}</span>
                    <span className="text-sm font-medium truncate">{location}</span>
                  </motion.button>
                ))}
              </div>
            </FilterSection>

            {/* Rating Section - Simplified with Input Fields */}
            <FilterSection
              title="Rating"
              icon={<Star className="w-4 h-4" />}
              isExpanded={expandedSections.rating}
              onToggle={() => toggleSection('rating')}
            >
              <div className="space-y-4">
                <div className="text-sm text-neutral-400 mb-3">
                  Choose the minimum and maximum rating (1-5 stars)
                </div>
                
                {/* Minimum Rating */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">
                    Minimum Rating ⭐
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min="0"
                      max="5"
                      step="0.5"
                      value={filters.minRating || ''}
                      onChange={(e) => {
                        const value = e.target.value === '' ? undefined : Number(e.target.value);
                        handleRatingChange(value, filters.maxRating);
                      }}
                      placeholder="0"
                      className="flex-1 px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-rose-500 transition-colors"
                    />
                    <span className="text-sm text-neutral-400">stars</span>
                  </div>
                </div>

                {/* Maximum Rating */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">
                    Maximum Rating ⭐
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min="0"
                      max="5"
                      step="0.5"
                      value={filters.maxRating || ''}
                      onChange={(e) => {
                        const value = e.target.value === '' ? undefined : Number(e.target.value);
                        handleRatingChange(filters.minRating, value);
                      }}
                      placeholder="5"
                      className="flex-1 px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-rose-500 transition-colors"
                    />
                    <span className="text-sm text-neutral-400">stars</span>
                  </div>
                </div>

                {/* Quick Rating Buttons */}
                <div className="pt-2">
                  <div className="text-xs text-neutral-500 mb-2">Quick options:</div>
                  <div className="flex flex-wrap gap-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <motion.button
                        key={rating}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleRatingChange(rating, 5)}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                          filters.minRating === rating
                            ? 'bg-rose-500 text-white'
                            : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                        }`}
                      >
                        {rating}+ stars
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </FilterSection>

            {/* Sort Section */}
            <FilterSection
              title="Sort By"
              icon={<SortAsc className="w-4 h-4" />}
              isExpanded={expandedSections.sort}
              onToggle={() => toggleSection('sort')}
            >
              <div className="space-y-2">
                {SORT_OPTIONS.map((option) => (
                  <motion.button
                    key={option.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSortChange(option.value)}
                    className={`flex items-center gap-3 w-full p-3 rounded-lg border transition-all duration-200 ${
                      `${filters.sortBy}-${filters.sortOrder}` === option.value
                        ? 'bg-rose-500/20 border-rose-500 text-rose-500'
                        : 'bg-neutral-800/50 border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:border-neutral-600'
                    }`}
                  >
                    {getSortIcon(option.value)}
                    <span className="text-sm font-medium">{option.label}</span>
                  </motion.button>
                ))}
              </div>
            </FilterSection>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

interface FilterSectionProps {
  title: string;
  icon: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function FilterSection({ title, icon, isExpanded, onToggle, children }: FilterSectionProps) {
  return (
    <div className="border-b border-neutral-800 pb-4 last:border-b-0">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-neutral-800/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          {icon}
          <span className="font-medium text-white">{title}</span>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4 text-neutral-400" />
        </motion.div>
      </button>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 