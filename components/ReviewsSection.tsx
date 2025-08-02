"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ReviewForm } from "./ReviewForm";
import { ReviewList } from "./ReviewList";
import { AverageRatingDisplay } from "./AverageRatingDisplay";
import { reviewsApi, Review, ReviewFormData, ReviewsResponse, AverageRatingResponse } from "@/lib/api";
import { useAuth } from "./AuthContext";

interface ReviewsSectionProps {
  businessId: number;
  businessName: string;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  businessId,
  businessName,
}) => {
  const { token, user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [isCheckingOwner, setIsCheckingOwner] = useState(false);

  // Fetch reviews
  const fetchReviews = async (page: number = 1, append: boolean = false) => {
    try {
      const data = await reviewsApi.getBusinessReviews(businessId, page, 10);
      
      if (append) {
        setReviews(prev => [...prev, ...data.reviews]);
      } else {
        setReviews(data.reviews);
      }
      
      setHasMore(data.pagination.page < data.pagination.pages);
      setCurrentPage(data.pagination.page);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  // Fetch average rating
  const fetchAverageRating = async () => {
    try {
      const data = await reviewsApi.getBusinessAverageRating(businessId);
      setAverageRating(data.averageRating);
      setTotalReviews(data.totalReviews);
    } catch (error) {
      console.error("Error fetching average rating:", error);
    }
  };

  // Submit review
  const handleSubmitReview = async (formData: ReviewFormData) => {
    setIsSubmitting(true);
    
    try {
      const newReview = await reviewsApi.createReview(formData, token);
      
      // Optimistically add the new review to the list
      setReviews(prev => [newReview, ...prev]);
      
      // Refresh average rating
      await fetchAverageRating();
      
      // Reset pagination
      setCurrentPage(1);
      setHasMore(true);
      
    } catch (error: any) {
      throw new Error(error.message || "Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Load more reviews
  const handleLoadMore = () => {
    if (hasMore && !isLoading) {
      fetchReviews(currentPage + 1, true);
    }
  };

  // Check if user is the business owner
  const checkOwnerStatus = async () => {
    if (!user || !token) {
      setIsOwner(false);
      return;
    }

    setIsCheckingOwner(true);
    try {
      const { isOwner: ownerStatus } = await reviewsApi.checkBusinessOwner(businessId, token);
      setIsOwner(ownerStatus);
    } catch (error) {
      console.error("Error checking owner status:", error);
      setIsOwner(false);
    } finally {
      setIsCheckingOwner(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await Promise.all([
        fetchReviews(1, false),
        fetchAverageRating(),
      ]);
      setIsLoading(false);
    };

    fetchData();
  }, [businessId]);

  // Check owner status when user or business changes
  useEffect(() => {
    checkOwnerStatus();
  }, [businessId, user, token]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Average Rating Display */}
      <AverageRatingDisplay
        averageRating={averageRating}
        totalReviews={totalReviews}
      />

      {/* Review Form - Only show if user is not the owner */}
      {!isOwner && (
        <ReviewForm
          businessId={businessId}
          onSubmit={handleSubmitReview}
          onSuccess={() => {
            // Optionally refresh reviews after successful submission
            fetchReviews(1, false);
          }}
        />
      )}

      {/* Owner Message */}
      {isOwner && user && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-3 p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg"
        >
          <div className="flex-1">
            <div className="text-blue-400 font-medium">Business Owner</div>
            <div className="text-blue-300 text-sm">
              You cannot review your own business. This helps maintain the integrity of our review system.
            </div>
          </div>
        </motion.div>
      )}

      {/* Reviews List */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-6">
          Customer Reviews ({totalReviews})
        </h3>
        <ReviewList
          reviews={reviews}
          isLoading={isLoading}
          onLoadMore={handleLoadMore}
          hasMore={hasMore}
        />
      </div>

      {/* SEO Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": businessName,
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": averageRating,
              "reviewCount": totalReviews,
              "bestRating": 5,
              "worstRating": 1
            },
            "review": reviews.slice(0, 10).map(review => ({
              "@type": "Review",
              "author": {
                "@type": "Person",
                "name": review.name || "Anonymous"
              },
              "reviewRating": {
                "@type": "Rating",
                "ratingValue": review.rating,
                "bestRating": 5,
                "worstRating": 1
              },
              "reviewBody": review.text,
              "datePublished": review.createdAt
            }))
          })
        }}
      />
    </motion.section>
  );
}; 