"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { StarRating } from "./StarRating";
import { ReviewFormData } from "@/lib/api";
import { CheckCircle, AlertCircle, Lock } from "lucide-react";
import { useAuth } from "./AuthContext";

interface ReviewFormProps {
  businessId: number;
  onSubmit: (data: ReviewFormData) => Promise<void>;
  onSuccess?: () => void;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({
  businessId,
  onSubmit,
  onSuccess,
}) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<ReviewFormData>({
    businessId,
    name: "",
    rating: 0,
    text: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user is authenticated
    if (!user) {
      setError("You must be logged in to submit a review");
      return;
    }
    
    if (formData.rating === 0) {
      setError("Please select a rating");
      return;
    }

    if (formData.text.trim().length < 10) {
      setError("Review must be at least 10 characters");
      return;
    }

    if (formData.text.trim().length > 1000) {
      setError("Review must be less than 1000 characters");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      await onSubmit(formData);
      setSuccess("Review submitted successfully!");
      setFormData({
        businessId,
        name: "",
        rating: 0,
        text: "",
      });
      if (onSuccess) {
        setTimeout(onSuccess, 1500);
      }
    } catch (err: any) {
      setError(err.message || "Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRatingChange = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }));
    setError("");
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setFormData(prev => ({ ...prev, text }));
    setError("");
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, name: e.target.value }));
  };

  const characterCount = formData.text.length;
  const isTextValid = characterCount >= 10 && characterCount <= 1000;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-neutral-900/60 backdrop-blur-lg rounded-2xl p-6 border border-neutral-800"
    >
      <h3 className="text-xl font-semibold mb-4 text-white">Write a Review</h3>
      
      {/* Authentication Check */}
      {!user && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-3 p-4 bg-amber-500/20 border border-amber-500/30 rounded-lg mb-4"
        >
          <Lock className="w-5 h-5 text-amber-400" />
          <div className="flex-1">
            <div className="text-amber-400 font-medium">Login Required</div>
            <div className="text-amber-300 text-sm">
              You must be logged in to submit a review. Please{" "}
              <a href="/login" className="underline hover:text-amber-200">
                login
              </a>{" "}
              or{" "}
              <a href="/register" className="underline hover:text-amber-200">
                register
              </a>{" "}
              to continue.
            </div>
          </div>
        </motion.div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">
            Your Rating *
          </label>
          <StarRating
            rating={formData.rating}
            onRatingChange={handleRatingChange}
            interactive={true}
            size="lg"
          />
        </div>

        {/* Name (Optional) */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-neutral-300 mb-2">
            Your Name (Optional)
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={handleNameChange}
            placeholder="Anonymous"
            className="w-full rounded-lg border-0 bg-neutral-800/60 p-3 text-base outline-none ring-1 ring-neutral-700 focus:ring-fuchsia-500 transition text-white placeholder-neutral-500"
            maxLength={50}
          />
        </div>

        {/* Review Text */}
        <div>
          <label htmlFor="review" className="block text-sm font-medium text-neutral-300 mb-2">
            Your Review *
          </label>
          <textarea
            id="review"
            value={formData.text}
            onChange={handleTextChange}
            placeholder="Share your experience with this business..."
            className={`w-full rounded-lg border-0 bg-neutral-800/60 p-3 text-base outline-none ring-1 transition text-white placeholder-neutral-500 resize-none ${
              isTextValid ? "ring-neutral-700 focus:ring-fuchsia-500" : "ring-red-500"
            }`}
            rows={4}
            maxLength={1000}
            required
          />
          <div className="flex justify-between items-center mt-1">
            <span className={`text-xs ${
              isTextValid ? "text-neutral-400" : "text-red-400"
            }`}>
              {characterCount}/1000 characters
            </span>
            {characterCount < 10 && (
              <span className="text-xs text-red-400">
                Minimum 10 characters required
              </span>
            )}
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 p-3 bg-red-500/20 border border-red-500/30 rounded-lg"
          >
            <AlertCircle className="w-4 h-4 text-red-400" />
            <span className="text-red-400 text-sm">{error}</span>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 p-3 bg-green-500/20 border border-green-500/30 rounded-lg"
          >
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-green-400 text-sm">{success}</span>
          </motion.div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || formData.rating === 0 || !isTextValid || !user}
          className="w-full rounded-full bg-gradient-to-r from-fuchsia-600 to-rose-600 py-3 font-medium shadow hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:brightness-100"
        >
          {!user ? "Login to Submit Review" : isSubmitting ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </motion.div>
  );
}; 