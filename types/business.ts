export interface BusinessHours {
  day_of_week: number;
  open_time?: string;
  close_time?: string;
  is_closed: boolean;
}

export interface ServicePricing {
  service_name: string;
  current_price: number;
  recommended_price: number;
  pricing_strategy: string;
  confidence_score: number;
}

export interface Business {
  id?: number;
  name: string;
  category: string;
  description: string;
  services: string;
  service_pricing?: { [key: string]: ServicePricing };
  image_url: string;
  rating?: number;
  location: string;
  latitude?: number;
  longitude?: number;
  images?: { id: number; image_url: string }[];
  business_hours?: string;
  hours?: BusinessHours[];
  socials?: {
    instagram?: string;
    facebook?: string;
    x?: string;
    linkedin?: string;
    website?: string;
    phone?: string;
    email?: string;
  };
}

export interface Review {
  id: number;
  businessId: number;
  name?: string;
  rating: number;
  text: string;
  createdAt: string;
}

export interface ReviewFormData {
  businessId: number;
  name?: string;
  rating: number;
  text: string;
}

export interface ReviewsResponse {
  reviews: Review[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface AverageRatingResponse {
  averageRating: number;
  totalReviews: number;
  businessId: number;
}
