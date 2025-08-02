'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  Star,
  MapPin,
  Clock
} from 'lucide-react';
import { pricingApi, PriceComparisonResponse } from '@/lib/api';

interface PriceComparisonWidgetProps {
  category: string;
  location: string;
  businessId?: number; // Optional: for personalized analysis
  className?: string;
}

export default function PriceComparisonWidget({ 
  category, 
  location, 
  businessId,
  className = "" 
}: PriceComparisonWidgetProps) {
  const [comparisonData, setComparisonData] = useState<PriceComparisonResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const loadComparisonData = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await pricingApi.getPriceComparison(category, location, businessId);
      setComparisonData(data);
    } catch (err: any) {
      setError(err.message || "Failed to load price comparison");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isExpanded && !comparisonData && !loading) {
      loadComparisonData();
    }
  }, [isExpanded, category, location]);

  const getStrategyColor = (strategy: string) => {
    switch (strategy.toLowerCase()) {
      case 'premium':
        return 'text-purple-400 bg-purple-500/20 border-purple-500/30';
      case 'competitive':
        return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      case 'budget':
        return 'text-green-400 bg-green-500/20 border-green-500/30';
      default:
        return 'text-neutral-400 bg-neutral-500/20 border-neutral-500/30';
    }
  };

  const getPriceIndicator = (price: number, average: number) => {
    const difference = ((price - average) / average) * 100;
    if (difference > 10) {
      return { icon: <TrendingUp className="w-4 h-4 text-red-400" />, text: 'Higher than average', color: 'text-red-400' };
    } else if (difference < -10) {
      return { icon: <TrendingDown className="w-4 h-4 text-green-400" />, text: 'Lower than average', color: 'text-green-400' };
    } else {
      return { icon: <BarChart3 className="w-4 h-4 text-blue-400" />, text: 'Average price', color: 'text-blue-400' };
    }
  };

  return (
    <div className={`bg-neutral-900/60 backdrop-blur-lg rounded-2xl border border-neutral-800 ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg">
              <DollarSign className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Market Price Comparison</h3>
              <p className="text-neutral-400 text-sm">Compare prices across {category} businesses</p>
            </div>
          </div>
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
          >
            {isExpanded ? 'Hide' : 'Show'} Comparison
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              {loading && (
                <div className="flex items-center justify-center py-8">
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400"></div>
                    <span className="text-neutral-300">Loading market data...</span>
                  </div>
                </div>
              )}

              {error && (
                <div className="flex items-center gap-3 p-4 bg-red-500/20 border border-red-500/30 rounded-lg mb-4">
                  <span className="text-red-300">{error}</span>
                  <button
                    onClick={loadComparisonData}
                    className="ml-auto px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                  >
                    Retry
                  </button>
                </div>
              )}

              {!loading && !error && comparisonData && (
                <div className="space-y-6">
                  {/* Personalized Business Context */}
                  {comparisonData.business_context && (
                    <div className="p-4 bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-lg">
                      <h4 className="text-green-300 font-semibold mb-3">Your Business Analysis</h4>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-400">
                            {comparisonData.business_context.business_name}
                          </div>
                          <div className="text-sm text-neutral-400">Your Business</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-medium text-blue-400">
                            {comparisonData.business_context.business_rating}★
                          </div>
                          <div className="text-sm text-neutral-400">Your Rating</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-medium text-purple-400">
                            {comparisonData.business_context.business_reviews}
                          </div>
                          <div className="text-sm text-neutral-400">Your Reviews</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-medium text-yellow-400 capitalize">
                            {comparisonData.business_context.market_position}
                          </div>
                          <div className="text-sm text-neutral-400">Market Position</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Personalized Market Insights */}
                  {comparisonData.personalized_insights && (
                    <div className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg">
                      <h4 className="text-purple-300 font-semibold mb-3">Personalized Market Insights</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-purple-400 capitalize">
                            {comparisonData.personalized_insights.competitive_position}
                          </div>
                          <div className="text-sm text-neutral-400">Competitive Position</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-medium text-pink-400">
                            {comparisonData.personalized_insights.market_share}
                          </div>
                          <div className="text-sm text-neutral-400">Market Share</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-medium text-blue-400">
                            {comparisonData.personalized_insights.market_opportunity}
                          </div>
                          <div className="text-sm text-neutral-400">Market Opportunity</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Market Overview */}
                  <div className="p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg">
                    <h4 className="text-blue-300 font-semibold mb-3">Market Overview</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-400">
                          ${comparisonData.market_average.average_price}
                        </div>
                        <div className="text-sm text-neutral-400">Average Price</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-medium text-purple-400">
                          {comparisonData.market_average.price_range}
                        </div>
                        <div className="text-sm text-neutral-400">Price Range</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-medium text-green-400 capitalize">
                          {comparisonData.market_average.market_position}
                        </div>
                        <div className="text-sm text-neutral-400">Market Position</div>
                      </div>
                    </div>
                  </div>

                  {/* Price Comparison Table */}
                  <div>
                    <h4 className="text-white font-semibold mb-4">Business Price Comparison</h4>
                    <div className="space-y-3">
                      {comparisonData.comparison_data.slice(0, 8).map((business, index) => {
                        const priceIndicator = getPriceIndicator(
                          business.current_pricing.base_price, 
                          comparisonData.market_average.average_price
                        );
                        
                        return (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-4 bg-neutral-800/40 rounded-xl border border-neutral-700 hover:border-blue-500/30 transition-all duration-200"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                  {priceIndicator.icon}
                                  <div>
                                    <h5 className="text-white font-medium">{business.name}</h5>
                                    <div className="flex items-center gap-2 text-sm text-neutral-400">
                                      <MapPin className="w-3 h-3" />
                                      {business.location}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="text-right">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-lg font-bold text-green-400">
                                    ${business.current_pricing.base_price}
                                  </span>
                                  <span className={`text-xs px-2 py-1 rounded-full border ${getStrategyColor(business.pricing_strategy)}`}>
                                    {business.pricing_strategy}
                                  </span>
                                </div>
                                <div className={`text-xs ${priceIndicator.color}`}>
                                  {priceIndicator.text}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Price Insights */}
                  <div className="p-4 bg-neutral-800/40 rounded-xl border border-neutral-700">
                    <h4 className="text-white font-semibold mb-3">Price Insights</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-neutral-400 mb-1">Best Value</div>
                        <div className="text-green-400 font-medium">
                          {comparisonData.comparison_data.reduce((min, business) => 
                            business.current_pricing.base_price < min.current_pricing.base_price ? business : min
                          ).name}
                        </div>
                      </div>
                      <div>
                        <div className="text-neutral-400 mb-1">Premium Option</div>
                        <div className="text-purple-400 font-medium">
                          {comparisonData.comparison_data.reduce((max, business) => 
                            business.current_pricing.base_price > max.current_pricing.base_price ? business : max
                          ).name}
                        </div>
                      </div>
                      <div>
                        <div className="text-neutral-400 mb-1">Price Range</div>
                        <div className="text-blue-400 font-medium">
                          ${Math.min(...comparisonData.comparison_data.map(b => b.current_pricing.base_price))} - 
                          ${Math.max(...comparisonData.comparison_data.map(b => b.current_pricing.base_price))}
                        </div>
                      </div>
                      <div>
                        <div className="text-neutral-400 mb-1">Market Trend</div>
                        <div className="text-yellow-400 font-medium">
                          {comparisonData.market_average.average_price > 50 ? 'Premium Market' : 'Competitive Market'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tips */}
                  <div className="p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-lg">
                    <h4 className="text-yellow-300 font-semibold mb-2">💡 Price Shopping Tips</h4>
                    <ul className="text-sm text-neutral-300 space-y-1">
                      <li>• Compare prices across multiple businesses</li>
                      <li>• Consider value vs. price - higher price doesn't always mean better quality</li>
                      <li>• Look for seasonal discounts and promotions</li>
                      <li>• Check for package deals and bundles</li>
                    </ul>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
} 