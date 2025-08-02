import { Metadata } from 'next';
import AdvancedSearch from '@/components/AdvancedSearch';
import { searchApi, SearchFilters, SearchResult } from "@/lib/api";
import SearchBar from "@/components/SearchBar";
import SearchResults from "@/components/SearchResults";
import FilterPanel from "@/components/FilterPanel";
import PriceComparisonWidget from "@/components/PriceComparisonWidget";

export const metadata: Metadata = {
  title: 'Search Businesses | SFBiz - Discover Local Gems',
  description: 'Search and filter local businesses by category, location, rating, and more. Find the best restaurants, services, and businesses in your area.',
  keywords: 'business search, local businesses, restaurants, services, Georgia, Tbilisi, Batumi',
  openGraph: {
    title: 'Search Businesses | SFBiz',
    description: 'Discover local businesses with our advanced search and filtering system.',
    type: 'website',
  },
};

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Find the Perfect Business</h1>
          <p className="text-neutral-400 text-lg">Discover and compare businesses in your area</p>
        </div>
        
        <AdvancedSearch />
        
        {/* Price Comparison Widget */}
        <div className="mt-8">
          <PriceComparisonWidget
            category="Beauty & Spa"
            location="Tbilisi, Georgia"
            businessId={1} // Example business ID for personalized analysis
            className="mb-8"
          />
        </div>
      </div>
    </div>
  );
} 