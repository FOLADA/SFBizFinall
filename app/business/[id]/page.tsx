'use client';

import React, { useEffect, useState, Suspense } from "react";
import { Business, BusinessHours } from "@/types/business";
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaRegCircle,
  FaInstagram, 
  FaFacebook, 
  FaTwitter, 
  FaLinkedin, 
  FaGlobe,
  FaStar,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
  FaUpload,
  FaTrash,
  FaHeart,
  FaShare,
  FaCalendarAlt,
  FaUsers,
  FaAward,
  FaCheckCircle,
  FaImage
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useAuth } from "@/components/AuthContext";
import { ReviewsSection } from "@/components/ReviewsSection";
import LiveChat from "@/components/LiveChat";
import AppointmentBooking from "@/components/AppointmentBooking";
import AIServiceRecommendations from "@/components/AIServiceRecommendations";
import AIPricingDashboard from "@/components/AIPricingDashboard";

type Props = { params: Promise<{ id: string }> };

export default function BusinessPageWrapper({ params }: Props) {
  const unwrappedParams = React.use(params);
  return <BusinessPage id={unwrappedParams.id} />;
}

function BusinessPage({ id }: { id: string }) {
  const [business, setBusiness] = useState<Business | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, token } = useAuth();
  const [galleryImages, setGalleryImages] = useState<{ id: number; image_url: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isOwner, setIsOwner] = useState(false);
  const [businessHours, setBusinessHours] = useState<BusinessHours[]>([]);

  // Load business data
  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        setLoading(true);
        const url = `${process.env.NEXT_PUBLIC_API_URL}/businesses/${id}`;
        const res = await fetch(url, {
          cache: "no-store",
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`Server responded ${res.status}`);
        const businessData = await res.json();
        setBusiness(businessData);
      } catch (err) {
        if ((err as Error).name !== "AbortError")
          setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, [id]);

  // Load gallery images
  useEffect(() => {
    async function loadImages() {
      try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/businesses/${id}/images`);
        if (res.ok) {
          const images = await res.json();
          setGalleryImages(images);
        }
      } catch (error) {
        console.error("Error loading images:", error);
      }
    }
    if (business) loadImages();
  }, [id, business]);

  // Load business hours
  useEffect(() => {
    async function loadHours() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/businesses/${id}/hours`);
        if (res.ok) {
          const hours = await res.json();
          setBusinessHours(hours);
        }
      } catch (error) {
        console.error("Error loading business hours:", error);
      }
    }
    if (business) loadHours();
  }, [id, business]);

  // Check if user is owner
  useEffect(() => {
    async function checkOwner() {
      if (!user || !token) {
        setIsOwner(false);
        return;
      }
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/businesses/${id}/owner-check`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const { isOwner: ownerStatus } = await res.json();
          setIsOwner(ownerStatus);
        }
      } catch (error) {
        console.error("Error checking owner status:", error);
      }
    }
    checkOwner();
  }, [id, user, token]);

  // Helper function to get full image URL
  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `${process.env.NEXT_PUBLIC_API_URL}${imagePath}`;
  };

  // Image carousel navigation
  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === galleryImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? galleryImages.length - 1 : prev - 1
    );
  };

  // Image upload handler
  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || !token) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/businesses/${id}/images`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    if (res.ok) {
      const newImage = await res.json();
      setGalleryImages((prev) => [...prev, newImage]);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setUploading(false);
    }
  }

  // Image delete handler
  async function handleDeleteImage(imageId: number) {
    if (!token) return;
    try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/businesses/${id}/images/${imageId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
      if (res.ok) {
        setGalleryImages((prev) => prev.filter((img) => img.id !== imageId));
      }
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  }

  // Loading state
  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-fuchsia-500 mx-auto mb-4"></div>
          <p className="text-neutral-400">Loading business details...</p>
        </div>
      </main>
    );
  }

  // Error state
  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-white mb-4">Something went wrong</h1>
          <p className="text-neutral-400 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-fuchsia-600 text-white rounded-xl hover:bg-fuchsia-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  if (!business) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-neutral-400">Business not found</p>
        </div>
      </main>
    );
  }

  const services = business.services
    .split("\n")
    .filter((s) => s.trim() !== "");

  const mainImageUrl = getImageUrl(business.image_url);
  const allImages = mainImageUrl ? [mainImageUrl, ...galleryImages.map(img => getImageUrl(img.image_url))] : galleryImages.map(img => getImageUrl(img.image_url));

  return (
    <main className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-fuchsia-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Hero Section with Image Carousel */}
        <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
          {allImages.length > 0 ? (
            <>
              {/* Main Image */}
              <div className="relative w-full h-full">
                <img
                  src={allImages[currentImageIndex] || ''}
                  alt={`${business.name} - Image ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                
                {/* Image Navigation */}
                {allImages.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200 backdrop-blur-sm"
                    >
                      <FaChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200 backdrop-blur-sm"
                    >
                      <FaChevronRight className="w-5 h-5" />
                    </button>
                    
                    {/* Image Indicators */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {allImages.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-3 h-3 rounded-full transition-all duration-200 ${
                            index === currentImageIndex 
                              ? 'bg-white' 
                              : 'bg-white/50 hover:bg-white/70'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-neutral-800 to-neutral-900 flex items-center justify-center">
              <div className="text-center text-neutral-500">
                <FaImage className="w-16 h-16 mx-auto mb-4" />
                <p>No images available</p>
              </div>
            </div>
          )}

          {/* Hero Content Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-white"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-fuchsia-500/20 border border-fuchsia-500/30 rounded-full text-fuchsia-300 text-sm font-medium">
                    {business.category}
                  </span>
                  {business.rating && (
                    <div className="flex items-center gap-1 px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full">
                      <FaStar className="w-4 h-4 text-yellow-400" />
                      <span className="text-yellow-300 text-sm font-medium">
                        {business.rating}
                      </span>
                    </div>
                  )}
                </div>
                
                <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white to-neutral-200 bg-clip-text text-transparent">
                {business.name}
              </h1>
              
                {/* Quick Actions */}
                <div className="flex flex-wrap gap-4">
                <AppointmentBooking 
                  businessId={business.id!}
                  businessName={business.name}
                  businessPhone={business.socials?.phone}
                  businessEmail={business.socials?.email}
                />
                
                {business.socials?.phone && (
                  <motion.a
                    href={`tel:${business.socials.phone}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-xl shadow-lg hover:bg-green-600 transition-all duration-300 font-medium"
                  >
                      <FaPhone className="w-4 h-4" />
                      Call Now
                  </motion.a>
                )}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Column */}
            <div className="lg:col-span-2 space-y-8">
                             {/* About Section */}
                             <motion.section
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ duration: 0.6 }}
                 className="bg-neutral-900/60 backdrop-blur-lg rounded-2xl p-8 border border-neutral-800"
               >
                 <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                   <FaAward className="text-fuchsia-500" />
                   About {business.name}
                 </h2>
                 <p className="text-neutral-300 text-lg leading-relaxed mb-6 break-words">
                   {business.description}
                 </p>
                 
                 {business.location && (
                   <div className="flex items-center gap-3 text-neutral-400">
                     <FaMapMarkerAlt className="text-fuchsia-500 flex-shrink-0" />
                     <span className="break-words">{business.location}</span>
                   </div>
                 )}
        </motion.section>

        {/* Services Section */}
        <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-neutral-900/60 backdrop-blur-lg rounded-2xl p-8 border border-neutral-800"
              >
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <FaCheckCircle className="text-fuchsia-500" />
                  Our Services
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((service, i) => (
                    <motion.div
                key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center gap-3 p-4 bg-neutral-800/40 rounded-xl border border-neutral-700 hover:border-fuchsia-500/30 transition-all duration-200"
                    >
                      <FaRegCircle className="text-fuchsia-500 flex-shrink-0" />
                      <span className="text-neutral-200 font-medium">{service}</span>
                    </motion.div>
            ))}
          </div>
        </motion.section>

              {/* AI Service Recommendations for Owners */}
              {isOwner && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.15 }}
                  className="bg-neutral-900/60 backdrop-blur-lg rounded-2xl p-8 border border-neutral-800"
                >
                  <AIServiceRecommendations
                    businessId={business.id!}
                    businessName={business.name}
                    onServiceAdd={(serviceName) => {
                      // This would typically update the business services
                      // For now, we'll just show a notification
                      alert(`Service "${serviceName}" would be added to your business. This feature is coming soon!`);
                    }}
                  />
                </motion.section>
              )}

              {/* AI Pricing Dashboard for Owners */}
              {isOwner && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="bg-neutral-900/60 backdrop-blur-lg rounded-2xl p-8 border border-neutral-800"
                >
                  <AIPricingDashboard
                    businessId={business.id!}
                    businessName={business.name}
                    businessCategory={business.category}
                    businessLocation={business.location}
                  />
                </motion.section>
              )}

              {/* Gallery Section */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-neutral-900/60 backdrop-blur-lg rounded-2xl p-8 border border-neutral-800"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <FaImage className="text-fuchsia-500" />
                    Gallery
                  </h2>
                  {isOwner && (
                    <label className="flex items-center gap-2 px-4 py-2 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 transition-colors cursor-pointer">
                      <FaUpload className="w-4 h-4" />
                      Upload
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {galleryImages.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {galleryImages.map((img, index) => (
                      <motion.div
                        key={img.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className="relative group cursor-pointer"
                      >
                        <img
                          src={getImageUrl(img.image_url) || ''}
                          alt={`Gallery ${index + 1}`}
                          className="w-full h-32 object-cover rounded-xl shadow-lg border border-neutral-700 group-hover:border-fuchsia-500/50 transition-all duration-200"
                          onClick={() => setSelectedImage(getImageUrl(img.image_url) || '')}
                        />
                        {isOwner && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteImage(img.id);
                            }}
                            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all duration-200"
                          >
                            <FaTrash className="w-3 h-3" />
                          </button>
                        )}
                      </motion.div>
                    ))}
                    </div>
                ) : (
                  <div className="text-center py-12 text-neutral-500">
                    <FaImage className="w-16 h-16 mx-auto mb-4" />
                    <p>No gallery images yet</p>
                    {isOwner && (
                      <p className="text-sm mt-2">Upload some images to showcase your business</p>
                    )}
          </div>
        )}
              </motion.section>

        {/* Reviews Section */}
        <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-neutral-900/60 backdrop-blur-lg rounded-2xl p-8 border border-neutral-800"
        >
          <ReviewsSection
            businessId={business.id!}
            businessName={business.name}
          />
        </motion.section>
      </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-neutral-900/60 backdrop-blur-lg rounded-2xl p-6 border border-neutral-800 "
              >
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                  <FaUsers className="text-fuchsia-500" />
                  Contact Info
                </h3>
                
                <div className="space-y-4">
                  {business.socials?.phone && (
                    <a
                      href={`tel:${business.socials.phone}`}
                      className="flex items-center gap-3 p-3 bg-neutral-800/40 rounded-lg hover:bg-neutral-700/40 transition-colors"
                    >
                      <FaPhone className="text-fuchsia-500" />
                      <span className="text-neutral-200">{business.socials.phone}</span>
                    </a>
                  )}
                  
                  {business.socials?.email && (
                    <a
                      href={`mailto:${business.socials.email}`}
                      className="flex items-center gap-3 p-3 bg-neutral-800/40 rounded-lg hover:bg-neutral-700/40 transition-colors"
                    >
                      <FaEnvelope className="text-fuchsia-500" />
                      <span className="text-neutral-200">{business.socials.email}</span>
                    </a>
                  )}
                  
                  {business.location && (
                    <div className="flex items-center gap-3 p-3 bg-neutral-800/40 rounded-lg">
                      <FaMapMarkerAlt className="text-fuchsia-500" />
                      <span className="text-neutral-200">{business.location}</span>
                    </div>
                  )}
                </div>

                {/* Social Links */}
                {business.socials && (
                  <div className="mt-6">
                    <h4 className="text-lg font-semibold text-white mb-4">Follow Us</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {business.socials.website && (
                        <a
                          href={business.socials.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 p-3 bg-green-600/20 border border-green-500/30 rounded-lg hover:bg-green-600/30 transition-colors"
                        >
                          <FaGlobe className="text-green-400" />
                          <span className="text-green-300 text-sm">Website</span>
                        </a>
                      )}
                      
                      {business.socials.instagram && (
                        <a
                          href={business.socials.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 p-3 bg-pink-600/20 border border-pink-500/30 rounded-lg hover:bg-pink-600/30 transition-colors"
                        >
                          <FaInstagram className="text-pink-400" />
                          <span className="text-pink-300 text-sm">Instagram</span>
                        </a>
                      )}
                      
                      {business.socials.facebook && (
                        <a
                          href={business.socials.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 p-3 bg-blue-600/20 border border-blue-500/30 rounded-lg hover:bg-blue-600/30 transition-colors"
                        >
                          <FaFacebook className="text-blue-400" />
                          <span className="text-blue-300 text-sm">Facebook</span>
                        </a>
                      )}
                      
                      {business.socials.x && (
                        <a
                          href={business.socials.x}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 p-3 bg-neutral-600/20 border border-neutral-500/30 rounded-lg hover:bg-neutral-600/30 transition-colors"
                        >
                          <FaTwitter className="text-neutral-400" />
                          <span className="text-neutral-300 text-sm">X (Twitter)</span>
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Business Hours Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-neutral-900/60 backdrop-blur-lg rounded-2xl p-6 border border-neutral-800"
              >
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                  <FaClock className="text-fuchsia-500" />
                  Business Hours
                </h3>
                
                <div className="space-y-3">
                  {businessHours.length > 0 ? (
                    businessHours.map((hour) => (
                      <div key={hour.day_of_week} className="flex justify-between items-center p-3 bg-neutral-800/40 rounded-lg">
                        <span className="text-neutral-300">
                          {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][hour.day_of_week]}
                        </span>
                        <span className="text-neutral-200 font-medium">
                          {hour.is_closed 
                            ? "Closed" 
                            : `${hour.open_time || "00:00"} - ${hour.close_time || "00:00"}`
                          }
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-neutral-800/40 rounded-lg">
                        <span className="text-neutral-300">Monday - Friday</span>
                        <span className="text-neutral-200 font-medium">9:00 AM - 6:00 PM</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-neutral-800/40 rounded-lg">
                        <span className="text-neutral-300">Saturday</span>
                        <span className="text-neutral-200 font-medium">10:00 AM - 4:00 PM</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-neutral-800/40 rounded-lg">
                        <span className="text-neutral-300">Sunday</span>
                        <span className="text-neutral-200 font-medium">Closed</span>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-4xl max-h-[90vh] p-4">
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
              >
                <FaTimes className="w-6 h-6" />
              </button>
              <img
                src={selectedImage}
                alt="Full size preview"
                className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Live Chat Widget */}
      <LiveChat 
        businessId={business.id!}
        businessName={business.name}
        businessPhone={business.socials?.phone}
        businessEmail={business.socials?.email}
      />
    </main>
  );
}
