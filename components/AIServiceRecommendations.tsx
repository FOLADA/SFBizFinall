'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Lightbulb, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  Plus,
  Loader2,
  AlertCircle,
  CheckCircle,
  Star
} from 'lucide-react';
import { aiApi, ServiceRecommendation } from '@/lib/api';
import { useAuth } from '@/components/AuthContext';

interface AIServiceRecommendationsProps {
  businessId: number;
  businessName: string;
  onServiceAdd?: (service: string) => void;
  className?: string;
}

export default function AIServiceRecommendations({ 
  businessId, 
  businessName, 
  onServiceAdd,
  className = "" 
}: AIServiceRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<ServiceRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const { token } = useAuth();

  const loadRecommendations = async () => {
    if (!token) {
      setError("Authentication required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await aiApi.getServiceRecommendations(businessId, token);
      setRecommendations(data.recommendations);
    } catch (err: any) {
      setError(err.message || "Failed to load recommendations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isExpanded && recommendations.length === 0 && !loading) {
      loadRecommendations();
    }
  }, [isExpanded, businessId, token]);

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'premium':
        return 'bg-purple-500/20 border-purple-500/30 text-purple-300';
      case 'core service':
        return 'bg-blue-500/20 border-blue-500/30 text-blue-300';
      case 'add-on':
        return 'bg-green-500/20 border-green-500/30 text-green-300';
      default:
        return 'bg-neutral-500/20 border-neutral-500/30 text-neutral-300';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'premium':
        return <Star className="w-4 h-4" />;
      case 'core service':
        return <CheckCircle className="w-4 h-4" />;
      case 'add-on':
        return <Plus className="w-4 h-4" />;
      default:
        return <Lightbulb className="w-4 h-4" />;
    }
  };

  const handleAddService = (serviceName: string) => {
    if (onServiceAdd) {
      onServiceAdd(serviceName);
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
            <div className="p-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg">
              <Sparkles className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">AI Service Recommendations</h3>
              <p className="text-neutral-400 text-sm">Powered by artificial intelligence</p>
            </div>
          </div>
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
          >
            {isExpanded ? 'Hide' : 'Show'} Recommendations
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
                    <Loader2 className="w-5 h-5 animate-spin text-purple-400" />
                    <span className="text-neutral-300">Analyzing your business...</span>
                  </div>
                </div>
              )}

              {error && (
                <div className="flex items-center gap-3 p-4 bg-red-500/20 border border-red-500/30 rounded-lg mb-4">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  <span className="text-red-300">{error}</span>
                  <button
                    onClick={loadRecommendations}
                    className="ml-auto px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                  >
                    Retry
                  </button>
                </div>
              )}

              {!loading && !error && recommendations.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-neutral-400 text-sm">
                    <TrendingUp className="w-4 h-4" />
                    <span>Based on your business category and market analysis</span>
                  </div>

                  <div className="grid gap-4">
                    {recommendations.map((recommendation, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 bg-neutral-800/40 rounded-xl border border-neutral-700 hover:border-purple-500/30 transition-all duration-200"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg border ${getCategoryColor(recommendation.category)}`}>
                              {getCategoryIcon(recommendation.category)}
                            </div>
                            <div>
                              <h4 className="text-white font-semibold">{recommendation.service_name}</h4>
                              <span className={`text-xs px-2 py-1 rounded-full border ${getCategoryColor(recommendation.category)}`}>
                                {recommendation.category}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 text-neutral-400">
                            <DollarSign className="w-4 h-4" />
                            <span className="text-sm font-medium">{recommendation.estimated_price_range}</span>
                          </div>
                        </div>

                        <p className="text-neutral-300 text-sm mb-3">
                          {recommendation.description}
                        </p>

                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2 text-neutral-400 text-xs">
                            <Lightbulb className="w-3 h-3" />
                            <span className="italic">{recommendation.reasoning}</span>
                          </div>

                          {onServiceAdd && (
                            <button
                              onClick={() => handleAddService(recommendation.service_name)}
                              className="flex items-center gap-2 px-3 py-1 bg-purple-600/20 border border-purple-500/30 text-purple-300 rounded-lg hover:bg-purple-600/30 transition-colors text-sm"
                            >
                              <Plus className="w-3 h-3" />
                              Add Service
                            </button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      <span className="text-purple-300 font-medium">AI Insights</span>
                    </div>
                    <p className="text-neutral-300 text-sm">
                      These recommendations are generated by analyzing your business category, 
                      current services, and market trends. Consider adding services that align 
                      with your business goals and customer needs.
                    </p>
                  </div>
                </div>
              )}

              {!loading && !error && recommendations.length === 0 && (
                <div className="text-center py-8 text-neutral-400">
                  <Sparkles className="w-12 h-12 mx-auto mb-4 text-neutral-500" />
                  <p>No recommendations available at the moment.</p>
                  <p className="text-sm mt-2">Try updating your business information for better suggestions.</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
} 