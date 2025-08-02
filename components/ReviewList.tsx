"use client";

import React from "react";
import { motion } from "framer-motion";
import { StarRating } from "./StarRating";
import { Review } from "@/lib/api";
import { User, Calendar } from "lucide-react";

interface ReviewListProps {
  reviews: Review[];
  isLoading?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

export const ReviewList: React.FC<ReviewListProps> = ({
  reviews,
  isLoading = false,
  onLoadMore,
  hasMore = false,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading && reviews.length === 0) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-neutral-900/60 backdrop-blur-lg rounded-2xl p-6 border border-neutral-800 animate-pulse"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-neutral-700 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-neutral-700 rounded w-24 mb-2"></div>
                <div className="h-3 bg-neutral-700 rounded w-32"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-neutral-700 rounded w-3/4"></div>
              <div className="h-4 bg-neutral-700 rounded w-1/2"></div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <div className="text-neutral-400 text-lg mb-2">No reviews yet</div>
        <div className="text-neutral-500 text-sm">
          Be the first to share your experience!
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review, index) => (
        <motion.div
          key={review.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-neutral-900/60 backdrop-blur-lg rounded-2xl p-6 border border-neutral-800 hover:border-neutral-700 transition-colors"
        >
          {/* Review Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-fuchsia-500 to-rose-500 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-medium text-white">
                  {review.name || "Anonymous"}
                </div>
                <div className="flex items-center gap-2 text-sm text-neutral-400">
                  <Calendar className="w-3 h-3" />
                  {formatDate(review.createdAt)}
                </div>
              </div>
            </div>
            <StarRating
              rating={review.rating}
              size="sm"
              className="flex-shrink-0"
            />
          </div>

          {/* Review Text */}
          <div className="text-neutral-300 leading-relaxed">
            {review.text}
          </div>
        </motion.div>
      ))}

      {/* Load More Button */}
      {hasMore && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center pt-4"
        >
          <button
            onClick={onLoadMore}
            disabled={isLoading}
            className="px-6 py-3 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Loading..." : "Load More Reviews"}
          </button>
        </motion.div>
      )}
    </div>
  );
}; 