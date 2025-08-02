'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  DollarSign, 
  BarChart3, 
  Target, 
  Settings, 
  Zap,
  TrendingDown,
  Calendar,
  Clock,
  Users,
  Star,
  AlertCircle,
  CheckCircle,
  Loader2,
  RefreshCw,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { 
  pricingApi, 
  PricingAnalysisResponse, 
  DynamicPricingConfig,
  PriceHistoryResponse,
  PriceComparisonResponse
} from '@/lib/api';
import { useAuth } from '@/components/AuthContext';

interface AIPricingDashboardProps {
  businessId: number;
  businessName: string;
  businessCategory: string;
  businessLocation: string;
  className?: string;
}

export default function AIPricingDashboard({ 
  businessId, 
  businessName, 
  businessCategory,
  businessLocation,
  className = "" 
}: AIPricingDashboardProps) {
  const [pricingData, setPricingData] = useState<PricingAnalysisResponse | null>(null);
  const [priceHistory, setPriceHistory] = useState<PriceHistoryResponse | null>(null);
  const [priceComparison, setPriceComparison] = useState<PriceComparisonResponse | null>(null);
  const [dynamicConfig, setDynamicConfig] = useState<DynamicPricingConfig>({
    enabled: false,
    base_price_adjustment: 0,
    demand_multiplier: 1.0,
    seasonal_adjustments: {},
    competitor_tracking: true,
    auto_adjust: false,
    min_price: 0,
    max_price: 1000,
    update_frequency: "daily"
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'analysis' | 'history' | 'comparison' | 'settings'>('analysis');
  const [isExpanded, setIsExpanded] = useState(false);
  const { token } = useAuth();

  const loadPricingData = async () => {
    if (!token) {
      setError("Authentication required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [analysisData, historyData, comparisonData] = await Promise.all([
        pricingApi.getPricingAnalysis(businessId, token),
        pricingApi.getPriceHistory(businessId),
        pricingApi.getPriceComparison(businessCategory, businessLocation, businessId) // Pass businessId for personalized analysis
      ]);

      setPricingData(analysisData);
      setPriceHistory(historyData);
      setPriceComparison(comparisonData);
    } catch (err: any) {
      setError(err.message || "Failed to load pricing data");
    } finally {
      setLoading(false);
    }
  };

  const handleDynamicPricingUpdate = async (config: DynamicPricingConfig) => {
    if (!token) return;

    try {
      const result = await pricingApi.setDynamicPricing(businessId, config, token);
      setDynamicConfig(result.config);
      // Show success message
    } catch (err: any) {
      setError(err.message || "Failed to update dynamic pricing");
    }
  };

  useEffect(() => {
    if (isExpanded && !pricingData && !loading) {
      loadPricingData();
    }
  }, [isExpanded, businessId, token]);

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

  const getTrendIcon = (trend: string) => {
    return trend === 'increasing' ? 
      <TrendingUp className="w-4 h-4 text-green-400" /> : 
      <TrendingDown className="w-4 h-4 text-red-400" />;
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
            <div className="p-2 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">AI Pricing Dashboard</h3>
              <p className="text-neutral-400 text-sm">Revenue optimization powered by AI</p>
            </div>
          </div>
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-200"
          >
            {isExpanded ? 'Hide' : 'Show'} Dashboard
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
                    <Loader2 className="w-5 h-5 animate-spin text-green-400" />
                    <span className="text-neutral-300">Analyzing pricing strategies...</span>
                  </div>
                </div>
              )}

              {error && (
                <div className="flex items-center gap-3 p-4 bg-red-500/20 border border-red-500/30 rounded-lg mb-4">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  <span className="text-red-300">{error}</span>
                  <button
                    onClick={loadPricingData}
                    className="ml-auto px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                  >
                    Retry
                  </button>
                </div>
              )}

              {!loading && !error && pricingData && (
                <div className="space-y-6">
                  {/* Tab Navigation */}
                  <div className="flex space-x-1 bg-neutral-800/50 rounded-lg p-1">
                    {[
                      { id: 'analysis', label: 'AI Analysis', icon: TrendingUp },
                      { id: 'history', label: 'Price History', icon: BarChart3 },
                      { id: 'comparison', label: 'Market Comparison', icon: Target },
                      { id: 'settings', label: 'Dynamic Pricing', icon: Settings }
                    ].map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id as any)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                            activeTab === tab.id
                              ? 'bg-green-600 text-white'
                              : 'text-neutral-400 hover:text-white hover:bg-neutral-700/50'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          {tab.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Tab Content */}
                  <AnimatePresence mode="wait">
                    {activeTab === 'analysis' && (
                      <motion.div
                        key="analysis"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                      >
                        {/* Revenue Optimization Summary */}
                        <div className="p-4 bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-lg">
                          <div className="flex items-center gap-2 mb-3">
                            <Zap className="w-5 h-5 text-green-400" />
                            <h4 className="text-green-300 font-semibold">Revenue Optimization</h4>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-green-400">
                                {pricingData.pricing_analysis.revenue_optimization.estimated_revenue_increase}
                              </div>
                              <div className="text-sm text-neutral-400">Revenue Increase</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-blue-400">
                                {pricingData.pricing_analysis.revenue_optimization.implementation_timeline}
                              </div>
                              <div className="text-sm text-neutral-400">Implementation</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-purple-400">
                                {pricingData.pricing_analysis.revenue_optimization.key_strategies.length}
                              </div>
                              <div className="text-sm text-neutral-400">Key Strategies</div>
                            </div>
                          </div>
                        </div>

                        {/* Service Pricing Recommendations */}
                        <div>
                          <h4 className="text-white font-semibold mb-4">Service Pricing Recommendations</h4>
                          <div className="grid gap-4">
                            {pricingData.pricing_analysis.service_pricing.map((service, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="p-4 bg-neutral-800/40 rounded-xl border border-neutral-700"
                              >
                                <div className="flex items-start justify-between mb-3">
                                  <div>
                                    <h5 className="text-white font-medium">{service.service_name}</h5>
                                    <span className={`text-xs px-2 py-1 rounded-full border ${getStrategyColor(service.pricing_strategy)}`}>
                                      {service.pricing_strategy}
                                    </span>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-neutral-400 text-sm">Current: {service.current_price_range}</div>
                                    <div className="text-green-400 font-medium">Recommended: {service.recommended_price_range}</div>
                                  </div>
                                </div>
                                <p className="text-neutral-300 text-sm">{service.reasoning}</p>
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        {/* Competitive Positioning */}
                        <div className="p-4 bg-neutral-800/40 rounded-xl border border-neutral-700">
                          <h4 className="text-white font-semibold mb-3">Competitive Positioning</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <div className="text-sm text-neutral-400">Target Position</div>
                              <div className="text-white font-medium capitalize">
                                {pricingData.pricing_analysis.competitive_positioning.target_position}
                              </div>
                            </div>
                            <div>
                              <div className="text-sm text-neutral-400">Price Advantage</div>
                              <div className="text-white font-medium capitalize">
                                {pricingData.pricing_analysis.competitive_positioning.price_advantage}
                              </div>
                            </div>
                            <div>
                              <div className="text-sm text-neutral-400">Value Proposition</div>
                              <div className="text-white font-medium">
                                {pricingData.pricing_analysis.competitive_positioning.value_proposition}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {activeTab === 'history' && priceHistory && (
                      <motion.div
                        key="history"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                      >
                        {/* Price Trends */}
                        <div className="p-4 bg-neutral-800/40 rounded-xl border border-neutral-700">
                          <h4 className="text-white font-semibold mb-4">Price Trends Analysis</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="text-center">
                              <div className="flex items-center justify-center gap-2 mb-2">
                                {getTrendIcon(priceHistory.trends.price_trend)}
                                <span className="text-sm text-neutral-400">Price Trend</span>
                              </div>
                              <div className="text-white font-medium capitalize">
                                {priceHistory.trends.price_trend}
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="flex items-center justify-center gap-2 mb-2">
                                {getTrendIcon(priceHistory.trends.revenue_trend)}
                                <span className="text-sm text-neutral-400">Revenue Trend</span>
                              </div>
                              <div className="text-white font-medium capitalize">
                                {priceHistory.trends.revenue_trend}
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm text-neutral-400 mb-2">Price Volatility</div>
                              <div className="text-white font-medium">
                                ${priceHistory.trends.price_volatility}
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm text-neutral-400 mb-2">Optimal Range</div>
                              <div className="text-white font-medium">
                                {priceHistory.trends.optimal_price_range}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Price History Chart */}
                        <div className="p-4 bg-neutral-800/40 rounded-xl border border-neutral-700">
                          <h4 className="text-white font-semibold mb-4">30-Day Price History</h4>
                          <div className="space-y-2">
                            {priceHistory.price_history.slice(-7).map((entry, index) => (
                              <div key={index} className="flex items-center justify-between p-2 bg-neutral-700/30 rounded">
                                <span className="text-neutral-300">{entry.date}</span>
                                <div className="flex items-center gap-4">
                                  <span className="text-green-400">${entry.price}</span>
                                  <span className="text-blue-400">Demand: {entry.demand}x</span>
                                  <span className="text-purple-400">Revenue: ${entry.revenue}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {activeTab === 'comparison' && priceComparison && (
                      <motion.div
                        key="comparison"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                      >
                        {/* Market Average */}
                        <div className="p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg">
                          <h4 className="text-blue-300 font-semibold mb-3">Market Overview</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-blue-400">
                                ${priceComparison.market_average.average_price}
                              </div>
                              <div className="text-sm text-neutral-400">Average Price</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-medium text-purple-400">
                                {priceComparison.market_average.price_range}
                              </div>
                              <div className="text-sm text-neutral-400">Price Range</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-medium text-green-400 capitalize">
                                {priceComparison.market_average.market_position}
                              </div>
                              <div className="text-sm text-neutral-400">Market Position</div>
                            </div>
                          </div>
                        </div>

                        {/* Competitor Comparison */}
                        <div>
                          <h4 className="text-white font-semibold mb-4">Competitor Analysis</h4>
                          <div className="grid gap-4">
                            {priceComparison.comparison_data.slice(0, 5).map((competitor, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="p-4 bg-neutral-800/40 rounded-xl border border-neutral-700"
                              >
                                <div className="flex items-center justify-between">
                                  <div>
                                    <h5 className="text-white font-medium">{competitor.name}</h5>
                                    <span className={`text-xs px-2 py-1 rounded-full border ${getStrategyColor(competitor.pricing_strategy)}`}>
                                      {competitor.pricing_strategy}
                                    </span>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-neutral-400 text-sm">Strategy</div>
                                    <div className="text-white font-medium capitalize">
                                      {competitor.pricing_strategy}
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {activeTab === 'settings' && (
                      <motion.div
                        key="settings"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                      >
                        {/* Dynamic Pricing Configuration */}
                        <div className="p-4 bg-neutral-800/40 rounded-xl border border-neutral-700">
                          <h4 className="text-white font-semibold mb-4">Dynamic Pricing Settings</h4>
                          
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-white font-medium">Enable Dynamic Pricing</div>
                                <div className="text-sm text-neutral-400">Automatically adjust prices based on demand</div>
                              </div>
                              <button
                                onClick={() => handleDynamicPricingUpdate({
                                  ...dynamicConfig,
                                  enabled: !dynamicConfig.enabled
                                })}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                  dynamicConfig.enabled ? 'bg-green-600' : 'bg-neutral-600'
                                }`}
                              >
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  dynamicConfig.enabled ? 'translate-x-6' : 'translate-x-1'
                                }`} />
                              </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm text-neutral-400">Base Price Adjustment (%)</label>
                                <input
                                  type="number"
                                  value={dynamicConfig.base_price_adjustment}
                                  onChange={(e) => handleDynamicPricingUpdate({
                                    ...dynamicConfig,
                                    base_price_adjustment: parseFloat(e.target.value) || 0
                                  })}
                                  className="w-full mt-1 px-3 py-2 bg-neutral-700 border border-neutral-600 rounded text-white"
                                />
                              </div>
                              <div>
                                <label className="text-sm text-neutral-400">Demand Multiplier</label>
                                <input
                                  type="number"
                                  step="0.1"
                                  value={dynamicConfig.demand_multiplier}
                                  onChange={(e) => handleDynamicPricingUpdate({
                                    ...dynamicConfig,
                                    demand_multiplier: parseFloat(e.target.value) || 1.0
                                  })}
                                  className="w-full mt-1 px-3 py-2 bg-neutral-700 border border-neutral-600 rounded text-white"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm text-neutral-400">Minimum Price</label>
                                <input
                                  type="number"
                                  value={dynamicConfig.min_price}
                                  onChange={(e) => handleDynamicPricingUpdate({
                                    ...dynamicConfig,
                                    min_price: parseFloat(e.target.value) || 0
                                  })}
                                  className="w-full mt-1 px-3 py-2 bg-neutral-700 border border-neutral-600 rounded text-white"
                                />
                              </div>
                              <div>
                                <label className="text-sm text-neutral-400">Maximum Price</label>
                                <input
                                  type="number"
                                  value={dynamicConfig.max_price}
                                  onChange={(e) => handleDynamicPricingUpdate({
                                    ...dynamicConfig,
                                    max_price: parseFloat(e.target.value) || 1000
                                  })}
                                  className="w-full mt-1 px-3 py-2 bg-neutral-700 border border-neutral-600 rounded text-white"
                                />
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-white font-medium">Auto-Adjust Prices</div>
                                <div className="text-sm text-neutral-400">Automatically apply pricing recommendations</div>
                              </div>
                              <button
                                onClick={() => handleDynamicPricingUpdate({
                                  ...dynamicConfig,
                                  auto_adjust: !dynamicConfig.auto_adjust
                                })}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                  dynamicConfig.auto_adjust ? 'bg-green-600' : 'bg-neutral-600'
                                }`}
                              >
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  dynamicConfig.auto_adjust ? 'translate-x-6' : 'translate-x-1'
                                }`} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
} 