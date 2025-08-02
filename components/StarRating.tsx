"use client";

import React, { useState } from "react";
import { Star } from "lucide-react";
import { motion } from "framer-motion";

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  className?: string;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  onRatingChange,
  size = "md",
  interactive = false,
  className = "",
}) => {
  const [hoverRating, setHoverRating] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const handleMouseEnter = (starIndex: number) => {
    if (interactive) {
      setHoverRating(starIndex + 1);
      setIsHovering(true);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0);
      setIsHovering(false);
    }
  };

  const handleClick = (starIndex: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(starIndex + 1);
    }
  };

  const displayRating = isHovering ? hoverRating : rating;

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {[0, 1, 2, 3, 4].map((starIndex) => {
        const isFilled = starIndex < displayRating;
        const isHalf = !isFilled && starIndex < displayRating - 0.5;

        return (
          <motion.button
            key={starIndex}
            type="button"
            className={`${
              interactive ? "cursor-pointer" : "cursor-default"
            } transition-colors duration-200 ${
              isFilled
                ? "text-yellow-400"
                : isHalf
                ? "text-yellow-400"
                : "text-gray-300"
            } hover:text-yellow-400`}
            onMouseEnter={() => handleMouseEnter(starIndex)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(starIndex)}
            disabled={!interactive}
            whileHover={interactive ? { scale: 1.1 } : {}}
            whileTap={interactive ? { scale: 0.95 } : {}}
          >
            <Star
              className={`${sizeClasses[size]} ${
                isHalf ? "fill-current" : isFilled ? "fill-current" : "fill-none"
              }`}
            />
          </motion.button>
        );
      })}
    </div>
  );
}; 