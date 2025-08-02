export interface SearchFilters {
  q?: string; // Search query
  category?: string[];
  location?: string[];
  minRating?: number;
  maxRating?: number;
  sortBy?: 'name' | 'rating' | 'recent' | 'distance';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface SearchResult {
  id: number;
  name: string;
  category: string;
  description: string;
  services: string;
  image_url: string;
  rating: number;
  location: string;
  latitude?: number;
  longitude?: number;
  totalReviews: number;
  distance?: number; // Distance from user location (if available)
}

export interface SearchResponse {
  businesses: SearchResult[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  filters: {
    categories: string[];
    locations: string[];
    ratingRange: {
      min: number;
      max: number;
    };
  };
  suggestions?: string[];
}

export interface SearchSuggestion {
  id: string;
  type: 'business' | 'category' | 'location';
  text: string;
  count?: number;
}

export interface SearchSuggestionsResponse {
  suggestions: SearchSuggestion[];
}

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
  icon?: string;
}

export interface SortOption {
  value: string;
  label: string;
  icon: string;
}

export const SORT_OPTIONS: SortOption[] = [
  { value: 'rating-desc', label: 'Highest Rated', icon: 'star' },
  { value: 'rating-asc', label: 'Lowest Rated', icon: 'star' },
  { value: 'name-asc', label: 'A-Z', icon: 'sort-alpha-asc' },
  { value: 'name-desc', label: 'Z-A', icon: 'sort-alpha-desc' },
  { value: 'recent-desc', label: 'Most Recent', icon: 'clock' },
  { value: 'distance-asc', label: 'Nearest', icon: 'map-pin' },
];

export const CATEGORIES = [
  'Restaurants & Cafes',
  'Health & Fitness',
  'Beauty & Wellness',
  'Shopping & Retail',
  'Entertainment',
  'Professional Services',
  'Home & Garden',
  'Automotive',
  'Education',
  'Technology',
  'Real Estate',
  'Travel & Tourism',
  'Sports & Recreation',
  'Arts & Culture',
  'Other',
];

export const LOCATIONS = [
  'Tbilisi',
  'Batumi',
  'Kutaisi',
  'Rustavi',
  'Gori',
  'Zugdidi',
  'Poti',
  'Telavi',
  'Akhaltsikhe',
  'Mtskheta',
  'Other',
]; 