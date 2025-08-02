"use client";

import React from "react";
import { motion } from "framer-motion";
import { StarRating } from "./StarRating";
import { Star, Users } from "lucide-react";

interface AverageRatingDisplayProps {
  averageRating: number;
  totalReviews: number;
  className?: string;
}

export const AverageRatingDisplay: React.FC<AverageRatingDisplayProps> = ({
  averageRating,
  totalReviews,
  className = "",
}) => {
  const getRatingText = (rating: number) => {
    if (rating >= 4.5) return "Excellent";
    if (rating >= 4.0) return "Very Good";
    if (rating >= 3.5) return "Good";
    if (rating >= 3.0) return "Average";
    if (rating >= 2.5) return "Below Average";
    return "Poor";
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return "text-green-400";
    if (rating >= 4.0) return "text-green-500";
    if (rating >= 3.5) return "text-yellow-400";
    if (rating >= 3.0) return "text-yellow-500";
    if (rating >= 2.5) return "text-orange-400";
    return "text-red-400";
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`bg-neutral-900/60 backdrop-blur-lg rounded-2xl p-6 border border-neutral-800 ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-white">Customer Reviews</h3>
        <div className="flex items-center gap-2 text-neutral-400">
          <Users className="w-4 h-4" />
          <span className="text-sm">{totalReviews} reviews</span>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-white mb-1">
            {averageRating.toFixed(1)}
          </div>
          <StarRating
            rating={averageRating}
            size="md"
            className="justify-center"
          />
        </div>
        <div className="flex-1">
          <div className={`text-lg font-semibold ${getRatingColor(averageRating)}`}>
            {getRatingText(averageRating)}
          </div>
          <div className="text-sm text-neutral-400">
            Based on {totalReviews} customer review{totalReviews !== 1 ? "s" : ""}
          </div>
        </div>
      </div>


    </motion.div>
  );
}; 