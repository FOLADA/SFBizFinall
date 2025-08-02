'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { SearchResult } from '@/lib/api';
import { formatRating, getRatingColor, formatDistance, getCategoryIcon } from '@/lib/utils';
import { Star, MapPin, Clock, Users, Building2, Search } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface SearchResultsProps {
  results: SearchResult[];
  isLoading: boolean;
  totalResults: number;
  currentPage: number;
  totalPages: number;
  onLoadMore: () => void;
  hasMore: boolean;
  className?: string;
}

export default function SearchResults({
  results,
  isLoading,
  totalResults,
  currentPage,
  totalPages,
  onLoadMore,
  hasMore,
  className = "",
}: SearchResultsProps) {
  if (isLoading && results.length === 0) {
    return <LoadingState />;
  }

  if (!isLoading && results.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Results Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <Building2 className="w-5 h-5 text-rose-500" />
          <h2 className="text-xl font-semibold text-white">
            {totalResults} {totalResults === 1 ? 'result' : 'results'} found
          </h2>
        </div>
        
        {totalPages > 1 && (
          <div className="text-sm text-neutral-400">
            Page {currentPage} of {totalPages}
          </div>
        )}
      </motion.div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {results.map((business, index) => (
            <motion.div
              key={business.id}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ 
                duration: 0.3, 
                delay: index * 0.1,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
              className="group"
            >
              <BusinessCard business={business} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Load More Button */}
      {hasMore && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center pt-8"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onLoadMore}
            disabled={isLoading}
            className="px-8 py-4 bg-gradient-to-r from-rose-500 to-fuchsia-500 text-white font-semibold rounded-2xl hover:from-rose-600 hover:to-fuchsia-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            {isLoading ? (
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Loading more...
              </div>
            ) : (
              'Load More Results'
            )}
          </motion.button>
        </motion.div>
      )}

      {/* Loading More Indicator */}
      {isLoading && results.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center pt-8"
        >
          <div className="flex items-center gap-3 text-neutral-400">
            <div className="w-5 h-5 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
            Loading more results...
          </div>
        </motion.div>
      )}
    </div>
  );
}

function BusinessCard({ business }: { business: SearchResult }) {
  return (
    <Link href={`/business/${business.id}`}>
      <motion.div
        whileHover={{ y: -5 }}
        transition={{ duration: 0.2 }}
        className="bg-neutral-900/80 backdrop-blur-xl border border-neutral-800 rounded-2xl overflow-hidden hover:border-rose-500/50 transition-all duration-300 group"
      >
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <Image
            src={business.image_url || '/placeholder-business.jpg'}
            alt={business.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-neutral-900/80 backdrop-blur-sm rounded-full border border-neutral-700">
              <span className="text-lg">{getCategoryIcon(business.category)}</span>
              <span className="text-xs font-medium text-white">{business.category}</span>
            </div>
          </div>

          {/* Rating Badge */}
          <div className="absolute top-4 right-4">
            <div className="flex items-center gap-1 px-3 py-1 bg-neutral-900/80 backdrop-blur-sm rounded-full border border-neutral-700">
              <Star className="w-3 h-3 text-yellow-500 fill-current" />
              <span className="text-xs font-medium text-white">
                {formatRating(business.rating)}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Title and Rating */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-white group-hover:text-rose-500 transition-colors line-clamp-2">
              {business.name}
            </h3>
            
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Star className={`w-4 h-4 ${getRatingColor(business.rating)}`} />
                <span className={`font-medium ${getRatingColor(business.rating)}`}>
                  {formatRating(business.rating)}
                </span>
                <span className="text-neutral-400">({business.totalReviews})</span>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 text-neutral-400">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{business.location}</span>
            {business.distance && (
              <span className="text-xs bg-neutral-800 px-2 py-1 rounded-full">
                {formatDistance(business.distance)}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-sm text-neutral-300 line-clamp-2">
            {business.description}
          </p>

          {/* Services */}
          {business.services && (
            <div className="flex items-center gap-2 text-neutral-400">
              <Clock className="w-4 h-4" />
              <span className="text-sm truncate">{business.services}</span>
            </div>
          )}
        </div>
      </motion.div>
    </Link>
  );
}

function LoadingState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-20 space-y-6"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-16 h-16 border-4 border-rose-500 border-t-transparent rounded-full"
      />
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold text-white">Searching...</h3>
        <p className="text-neutral-400">Finding the best businesses for you</p>
      </div>
    </motion.div>
  );
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 space-y-6"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring" }}
        className="w-24 h-24 bg-neutral-800 rounded-full flex items-center justify-center"
      >
        <Search className="w-12 h-12 text-neutral-400" />
      </motion.div>
      
      <div className="text-center space-y-4">
        <h3 className="text-2xl font-semibold text-white">No results found</h3>
        <p className="text-neutral-400 max-w-md">
          Try adjusting your search criteria or filters to find what you're looking for.
        </p>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 bg-rose-500 text-white font-medium rounded-xl hover:bg-rose-600 transition-colors"
        >
          Clear Filters
        </motion.button>
      </div>
    </motion.div>
  );
} 