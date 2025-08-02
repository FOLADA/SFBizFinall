"use client";

import { Business, BusinessHours } from "@/types/business";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/components/AuthContext";
import { 
  Upload, 
  X, 
  Plus, 
  MapPin, 
  Camera, 
  Globe, 
  Phone, 
  Mail, 
  Instagram, 
  Facebook, 
  Twitter, 
  Linkedin,
  Building2,
  FileText,
  Settings,
  Users,
  CheckCircle,
  AlertCircle,
  Loader2,
  Clock
} from "lucide-react";
import AIServiceRecommendations from "@/components/AIServiceRecommendations";
import AIPricingDashboard from "@/components/AIPricingDashboard";

const emptyForm: Business = {
  name: "",
  category: "",
  description: "",
  services: "",
  service_pricing: {},
  image_url: "",
  location: "",
};

const emptySocials = {
  instagram: "",
  facebook: "",
  x: "",
  linkedin: "",
  website: "",
  phone: "",
  email: "",
};

const categories = [
  "Restaurant & Food",
  "Health & Wellness",
  "Beauty & Spa",
  "Fitness & Sports",
  "Education & Training",
  "Technology & IT",
  "Retail & Shopping",
  "Professional Services",
  "Entertainment",
  "Automotive",
  "Real Estate",
  "Other"
];

const defaultHours: BusinessHours[] = [
  { day_of_week: 0, open_time: "09:00", close_time: "17:00", is_closed: false }, // Sunday
  { day_of_week: 1, open_time: "09:00", close_time: "17:00", is_closed: false }, // Monday
  { day_of_week: 2, open_time: "09:00", close_time: "17:00", is_closed: false }, // Tuesday
  { day_of_week: 3, open_time: "09:00", close_time: "17:00", is_closed: false }, // Wednesday
  { day_of_week: 4, open_time: "09:00", close_time: "17:00", is_closed: false }, // Thursday
  { day_of_week: 5, open_time: "09:00", close_time: "17:00", is_closed: false }, // Friday
  { day_of_week: 6, open_time: "10:00", close_time: "15:00", is_closed: false }, // Saturday
];

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function AddPage() {
  const [form, setForm] = useState<Business>(emptyForm);
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [mainImagePreview, setMainImagePreview] = useState<string>("");
  const [galleryImages, setGalleryImages] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [socials, setSocials] = useState({ ...emptySocials });
  const [currentStep, setCurrentStep] = useState(1);
  const [dragActive, setDragActive] = useState(false);
  const [currentServiceInput, setCurrentServiceInput] = useState<string>("");
  const [servicesList, setServicesList] = useState<string[]>([]);
  const [businessHours, setBusinessHours] = useState<BusinessHours[]>(defaultHours);
  const [servicePricing, setServicePricing] = useState<{ [key: string]: any }>({});
  
  const router = useRouter();
  const { token, user } = useAuth();
  const mainImageRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  const totalSteps = 4;

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
    setError(null);
  }

  function handleSocialChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setSocials((prev) => ({ ...prev, [name]: value }));
  }

  function handleHoursChange(dayIndex: number, field: keyof BusinessHours, value: string | boolean) {
    setBusinessHours(prev => 
      prev.map((hour, index) => 
        index === dayIndex 
          ? { ...hour, [field]: value }
          : hour
      )
    );
  }

  function toggleDayClosed(dayIndex: number) {
    setBusinessHours(prev => 
      prev.map((hour, index) => 
        index === dayIndex 
          ? { ...hour, is_closed: !hour.is_closed }
          : hour
      )
    );
  }

  function handleMainImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    setMainImage(file);
    setMainImagePreview(URL.createObjectURL(file));
    setForm(prev => ({ ...prev, image_url: file.name })); // Temporary name for backend
  }

  function handleGalleryChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setGalleryImages(prev => [...prev, ...files]);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setGalleryPreviews(prev => [...prev, ...newPreviews]);
  }

  function removeGalleryImage(index: number) {
    setGalleryImages(prev => prev.filter((_, i) => i !== index));
    setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
  }

  function handleDrag(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files);
      setGalleryImages(prev => [...prev, ...files]);
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setGalleryPreviews(prev => [...prev, ...newPreviews]);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!user || !token) {
      setError("You must be logged in to add a business");
      return;
    }
    
    if (!mainImage) {
      setError("Please select a main image for your business");
      return;
    }
    
    setUploading(true);
    setError(null);
    setSuccess(null);
    
    try {
      // 1. Create the business
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/businesses`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ 
          ...form, 
          socials,
          hours: businessHours,
          business_hours: JSON.stringify(businessHours),
          service_pricing: servicePricing
        }),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to create business");
      }
      
      const { id } = await res.json();
      
      // 2. Upload main image
      if (mainImage) {
        const mainImageFormData = new FormData();
        mainImageFormData.append("image", mainImage);
        const mainImgRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/businesses/${id}/images`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: mainImageFormData,
        });
        if (!mainImgRes.ok) throw new Error("Failed to upload main image");
        
        // Update business with main image URL
        const mainImageData = await mainImgRes.json();
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/businesses/${id}`, {
          method: "PATCH",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ image_url: mainImageData.image_url }),
        });
      }
      
      // 3. Upload gallery images
      if (galleryImages.length > 0) {
        for (const img of galleryImages) {
          const formData = new FormData();
          formData.append("image", img);
          const imgRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/businesses/${id}/images`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
          });
          if (!imgRes.ok) throw new Error("Failed to upload gallery image");
        }
      }
      
      setSuccess("Business created successfully! Redirecting...");
      setTimeout(() => {
      router.push(`/business/${id}`);
      }, 1500);
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return form.name && form.category && form.description;
      case 2:
        return servicesList.length > 0 && form.location;
      case 3:
        return true; // Socials are optional
      case 4:
        return mainImage;
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
  return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <Building2 className="w-12 h-12 mx-auto mb-4 text-fuchsia-500" />
              <h2 className="text-2xl font-bold text-white mb-2">Basic Information</h2>
              <p className="text-neutral-400">Tell us about your business</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Business Name *
                </label>
                <input
                  name="name"
                  type="text"
                  required
                  disabled={!user}
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your business name"
                  className="w-full rounded-xl border-0 bg-neutral-800/60 p-4 text-base outline-none ring-1 ring-neutral-700 focus:ring-fuchsia-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  required
                  disabled={!user}
                  value={form.category}
                  onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full rounded-xl border-0 bg-neutral-800/60 p-4 text-base outline-none ring-1 ring-neutral-700 focus:ring-fuchsia-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Description *
            </label>
              <textarea
                  name="description"
                  rows={4}
                required
                  disabled={!user}
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe your business, what makes it unique, and what customers can expect..."
                  className="w-full rounded-xl border-0 bg-neutral-800/60 p-4 text-base outline-none ring-1 ring-neutral-700 focus:ring-fuchsia-500 transition-all duration-200 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <Settings className="w-12 h-12 mx-auto mb-4 text-fuchsia-500" />
              <h2 className="text-2xl font-bold text-white mb-2">Services & Location</h2>
              <p className="text-neutral-400">What do you offer and where are you located?</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Services *
                </label>
                <div className="space-y-3">
                  {/* Services Input */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add a service (e.g., Haircuts and styling)"
                      value={currentServiceInput}
                      onChange={(e) => setCurrentServiceInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && currentServiceInput.trim()) {
                          e.preventDefault();
                          const newService = currentServiceInput.trim();
                          setServicesList(prevServices => {
                            if (!prevServices.includes(newService)) {
                              const updatedServices = [...prevServices, newService];
                              setForm(prev => ({ ...prev, services: updatedServices.join('\n') }));
                              return updatedServices;
                            }
                            return prevServices;
                          });
                          setCurrentServiceInput('');
                        }
                      }}
                      disabled={!user}
                      className="flex-1 rounded-xl border-0 bg-neutral-800/60 p-4 text-base outline-none ring-1 ring-neutral-700 focus:ring-fuchsia-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (currentServiceInput.trim()) {
                          const newService = currentServiceInput.trim();
                          setServicesList(prevServices => {
                            if (!prevServices.includes(newService)) {
                              const updatedServices = [...prevServices, newService];
                              setForm(prev => ({ ...prev, services: updatedServices.join('\n') }));
                              return updatedServices;
                            }
                            return prevServices;
                          });
                          setCurrentServiceInput('');
                        }
                      }}
                      disabled={!user || !currentServiceInput.trim()}
                      className="px-4 py-4 rounded-xl bg-gradient-to-r from-fuchsia-600 to-rose-600 text-white font-medium hover:brightness-110 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add
                    </button>
                  </div>
                  
                  {/* Services Tags */}
                  {servicesList.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {servicesList.map((service, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="flex items-center gap-2 bg-fuchsia-500/20 border border-fuchsia-500/30 rounded-lg px-3 py-2"
                        >
                          <span className="text-fuchsia-300 text-sm">{service}</span>
                          <button
                            type="button"
                            onClick={() => {
                              setServicesList(prevServices => {
                                const updatedServices = prevServices.filter((_, i) => i !== index);
                                setForm(prev => ({ ...prev, services: updatedServices.join('\n') }));
                                return updatedServices;
                              });
                            }}
                            className="text-fuchsia-400 hover:text-fuchsia-200 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  )}
                  
                  {/* Hidden textarea for form submission */}
                  <textarea
                    name="services"
                    value={servicesList.join('\n')}
                onChange={handleChange}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Service Pricing Section */}
              {servicesList.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Service Pricing
                  </h3>
                  <p className="text-neutral-400 text-sm">
                    Set pricing for your services to help AI provide better recommendations
                  </p>
                  
                  <div className="space-y-3">
                    {servicesList.map((service, index) => (
                      <div key={index} className="bg-neutral-800/40 rounded-xl p-4 border border-neutral-700">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-white font-medium">{service}</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm text-neutral-400 mb-1">Current Price ($)</label>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={servicePricing[service]?.current_price || ''}
                              onChange={(e) => {
                                setServicePricing(prev => ({
                                  ...prev,
                                  [service]: {
                                    ...prev[service],
                                    current_price: parseFloat(e.target.value) || 0
                                  }
                                }));
                              }}
                              className="w-full rounded-lg border-0 bg-neutral-700/60 p-3 text-white outline-none ring-1 ring-neutral-600 focus:ring-fuchsia-500 transition-all duration-200"
                              placeholder="0.00"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-neutral-400 mb-1">Pricing Strategy</label>
                            <select
                              value={servicePricing[service]?.pricing_strategy || 'competitive'}
                              onChange={(e) => {
                                setServicePricing(prev => ({
                                  ...prev,
                                  [service]: {
                                    ...prev[service],
                                    pricing_strategy: e.target.value
                                  }
                                }));
                              }}
                              className="w-full rounded-lg border-0 bg-neutral-700/60 p-3 text-white outline-none ring-1 ring-neutral-600 focus:ring-fuchsia-500 transition-all duration-200"
                            >
                              <option value="competitive">Competitive</option>
                              <option value="premium">Premium</option>
                              <option value="budget">Budget</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Service Recommendations */}
              <AIServiceRecommendations
                businessId={0} // Will be set after business creation
                businessName={form.name || "Your Business"}
                onServiceAdd={(serviceName) => {
                  if (!servicesList.includes(serviceName)) {
                    const updatedServices = [...servicesList, serviceName];
                    setServicesList(updatedServices);
                    setForm(prev => ({ ...prev, services: updatedServices.join('\n') }));
                  }
                }}
                className="mt-6"
              />

              {/* AI Pricing Dashboard */}
              <AIPricingDashboard
                businessId={0} // Will be set after business creation
                businessName={form.name || "Your Business"}
                businessCategory={form.category}
                businessLocation={form.location}
                className="mt-6"
              />

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Location *
                </label>
              <input
                  name="location"
                type="text"
                required
                  disabled={!user}
                  value={form.location}
                onChange={handleChange}
                  placeholder="Enter your business address"
                  className="w-full rounded-xl border-0 bg-neutral-800/60 p-4 text-base outline-none ring-1 ring-neutral-700 focus:ring-fuchsia-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              {/* Georgia (Sakartvelo) Map */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-neutral-300 mb-3">
                  Location Preview
                </label>
                <div className="relative rounded-xl overflow-hidden border border-neutral-700">
                  <img
                    src="https://maps.googleapis.com/maps/api/staticmap?center=41.7151,44.8271&zoom=7&size=600x300&markers=color:red%7C41.7151,44.8271&key=AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg"
                    alt="Georgia (Sakartvelo) Map"
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  <div className="absolute bottom-4 left-4">
                    <div className="flex items-center gap-2 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-2">
                      <MapPin className="w-4 h-4 text-fuchsia-400" />
                      <span className="text-white text-sm font-medium">Georgia (საქართველო)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Hours */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-neutral-300 mb-4 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Business Hours
                </label>
                <div className="space-y-3">
                  {businessHours.map((hour, index) => (
                    <motion.div
                      key={hour.day_of_week}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-3 p-4 bg-neutral-800/40 rounded-xl border border-neutral-700"
                    >
                      <div className="w-24 flex-shrink-0">
                        <span className="text-neutral-300 font-medium text-sm">
                          {dayNames[hour.day_of_week]}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 flex-1">
                        <input
                          type="time"
                          value={hour.open_time || ""}
                          onChange={(e) => handleHoursChange(index, "open_time", e.target.value)}
                          disabled={hour.is_closed || !user}
                          className="flex-1 rounded-lg border-0 bg-neutral-700/60 p-2 text-sm outline-none ring-1 ring-neutral-600 focus:ring-fuchsia-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        <span className="text-neutral-400">to</span>
                        <input
                          type="time"
                          value={hour.close_time || ""}
                          onChange={(e) => handleHoursChange(index, "close_time", e.target.value)}
                          disabled={hour.is_closed || !user}
                          className="flex-1 rounded-lg border-0 bg-neutral-700/60 p-2 text-sm outline-none ring-1 ring-neutral-600 focus:ring-fuchsia-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => toggleDayClosed(index)}
                        disabled={!user}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                          hour.is_closed
                            ? "bg-red-500/20 text-red-300 border border-red-500/30"
                            : "bg-green-500/20 text-green-300 border border-green-500/30"
                        }`}
                      >
                        {hour.is_closed ? "Closed" : "Open"}
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <Globe className="w-12 h-12 mx-auto mb-4 text-fuchsia-500" />
              <h2 className="text-2xl font-bold text-white mb-2">Contact & Social</h2>
              <p className="text-neutral-400">Help customers find and connect with you</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={socials.phone}
                  onChange={handleSocialChange}
                  placeholder="+1 (555) 123-4567"
                  disabled={!user}
                  className="w-full rounded-xl border-0 bg-neutral-800/60 p-4 text-base outline-none ring-1 ring-neutral-700 focus:ring-fuchsia-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={socials.email}
                  onChange={handleSocialChange}
                  placeholder="info@yourbusiness.com"
                  disabled={!user}
                  className="w-full rounded-xl border-0 bg-neutral-800/60 p-4 text-base outline-none ring-1 ring-neutral-700 focus:ring-fuchsia-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2 flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Website
                </label>
                <input
                  type="url"
                  name="website"
                  value={socials.website}
                  onChange={handleSocialChange}
                  placeholder="https://yourbusiness.com"
                  disabled={!user}
                  className="w-full rounded-xl border-0 bg-neutral-800/60 p-4 text-base outline-none ring-1 ring-neutral-700 focus:ring-fuchsia-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2 flex items-center gap-2">
                  <Instagram className="w-4 h-4" />
                  Instagram
                </label>
              <input
                type="url"
                name="instagram"
                value={socials.instagram}
                onChange={handleSocialChange}
                  placeholder="https://instagram.com/yourbusiness"
                  disabled={!user}
                  className="w-full rounded-xl border-0 bg-neutral-800/60 p-4 text-base outline-none ring-1 ring-neutral-700 focus:ring-fuchsia-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2 flex items-center gap-2">
                  <Facebook className="w-4 h-4" />
                  Facebook
                </label>
              <input
                type="url"
                name="facebook"
                value={socials.facebook}
                onChange={handleSocialChange}
                  placeholder="https://facebook.com/yourbusiness"
                  disabled={!user}
                  className="w-full rounded-xl border-0 bg-neutral-800/60 p-4 text-base outline-none ring-1 ring-neutral-700 focus:ring-fuchsia-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2 flex items-center gap-2">
                  <Twitter className="w-4 h-4" />
                  X (Twitter)
                </label>
              <input
                type="url"
                name="x"
                value={socials.x}
                onChange={handleSocialChange}
                  placeholder="https://x.com/yourbusiness"
                  disabled={!user}
                  className="w-full rounded-xl border-0 bg-neutral-800/60 p-4 text-base outline-none ring-1 ring-neutral-700 focus:ring-fuchsia-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2 flex items-center gap-2">
                  <Linkedin className="w-4 h-4" />
                  LinkedIn
                </label>
              <input
                type="url"
                name="linkedin"
                value={socials.linkedin}
                onChange={handleSocialChange}
                  placeholder="https://linkedin.com/company/yourbusiness"
                  disabled={!user}
                  className="w-full rounded-xl border-0 bg-neutral-800/60 p-4 text-base outline-none ring-1 ring-neutral-700 focus:ring-fuchsia-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <Camera className="w-12 h-12 mx-auto mb-4 text-fuchsia-500" />
              <h2 className="text-2xl font-bold text-white mb-2">Business Images</h2>
              <p className="text-neutral-400">Show off your business with great photos</p>
            </div>

            <div className="space-y-6">
              {/* Main Image Upload */}
            <div>
                <label className="block text-sm font-medium text-neutral-300 mb-3">
                  Main Business Image *
                </label>
                <div
                  onClick={() => mainImageRef.current?.click()}
                  className={`relative cursor-pointer rounded-xl border-2 border-dashed transition-all duration-200 ${
                    mainImagePreview 
                      ? 'border-fuchsia-500 bg-fuchsia-500/10' 
                      : 'border-neutral-600 hover:border-fuchsia-500 hover:bg-neutral-800/60'
                  }`}
                >
                  {mainImagePreview ? (
                    <div className="relative">
                      <img
                        src={mainImagePreview}
                        alt="Main business image"
                        className="w-full h-48 object-cover rounded-xl"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setMainImage(null);
                          setMainImagePreview("");
                          setForm(prev => ({ ...prev, image_url: "" }));
                        }}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
            </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-48 p-6">
                      <Upload className="w-12 h-12 text-neutral-500 mb-3" />
                      <p className="text-neutral-400 text-center">
                        Click to upload your main business image
                      </p>
                      <p className="text-neutral-500 text-sm mt-1">
                        This will be displayed on your business card
                      </p>
          </div>
                  )}
        </div>
                <input
                  ref={mainImageRef}
                  type="file"
                  accept="image/*"
                  onChange={handleMainImageChange}
                  className="hidden"
                  disabled={!user}
            />
          </div>

              {/* Gallery Images Upload */}
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-3">
                  Gallery Images
                </label>
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => galleryRef.current?.click()}
                  className={`relative cursor-pointer rounded-xl border-2 border-dashed transition-all duration-200 ${
                    dragActive 
                      ? 'border-fuchsia-500 bg-fuchsia-500/10' 
                      : 'border-neutral-600 hover:border-fuchsia-500 hover:bg-neutral-800/60'
                  }`}
                >
                  <div className="flex flex-col items-center justify-center h-32 p-6">
                    <Upload className="w-8 h-8 text-neutral-500 mb-2" />
                    <p className="text-neutral-400 text-center text-sm">
                      Click or drag to upload gallery images
                    </p>
                    <p className="text-neutral-500 text-xs mt-1">
                      These will be displayed in your business gallery
                    </p>
                  </div>
                </div>
          <input
                  ref={galleryRef}
            type="file"
            accept="image/*"
            multiple
                  onChange={handleGalleryChange}
                  className="hidden"
                  disabled={!user}
                />
              </div>

              {/* Gallery Preview */}
              {galleryPreviews.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-3">
                    Gallery Preview ({galleryPreviews.length} images)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {galleryPreviews.map((src, index) => (
                      <div key={index} className="relative group">
                        <img
                  src={src}
                          alt={`Gallery ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(index)}
                          className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all duration-200"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-fuchsia-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-rose-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-fuchsia-400 to-rose-400 bg-clip-text text-transparent mb-4"
          >
            Add Your Business
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-neutral-400 text-lg"
          >
            Showcase your business to the world
          </motion.p>
        </div>

        {/* Authentication Check */}
        {!user && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto mb-8"
          >
            <div className="flex items-center gap-4 p-6 bg-amber-500/20 border border-amber-500/30 rounded-2xl backdrop-blur-lg">
              <AlertCircle className="w-8 h-8 text-amber-400 flex-shrink-0" />
              <div>
                <div className="text-amber-400 font-semibold mb-1">Login Required</div>
                <div className="text-amber-300 text-sm">
                  You must be logged in to add a business. Please{" "}
                  <a href="/login" className="underline hover:text-amber-200 font-medium">
                    login
                  </a>{" "}
                  or{" "}
                  <a href="/register" className="underline hover:text-amber-200 font-medium">
                    register
                  </a>{" "}
                  to continue.
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Progress Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl mx-auto mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-neutral-400">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-sm font-medium text-neutral-400">
              {Math.round((currentStep / totalSteps) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-neutral-800 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-fuchsia-500 to-rose-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </motion.div>

        {/* Form Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-2xl mx-auto"
        >
          <div className="bg-neutral-900/80 backdrop-blur-xl rounded-3xl border border-neutral-800 p-8 shadow-2xl">
            <AnimatePresence mode="wait">
              {renderStepContent()}
            </AnimatePresence>

            {/* Error/Success Messages */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-3 p-4 bg-red-500/20 border border-red-500/30 rounded-xl mt-6"
                >
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <span className="text-red-400 text-sm">{error}</span>
                </motion.div>
              )}

              {success && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-3 p-4 bg-green-500/20 border border-green-500/30 rounded-xl mt-6"
                >
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-green-400 text-sm">{success}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-neutral-800">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center gap-2 px-6 py-3 rounded-xl border border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:border-neutral-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!isStepValid()}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-fuchsia-600 to-rose-600 text-white font-medium hover:brightness-110 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              ) : (
        <button
          type="submit"
                  onClick={handleSubmit}
                  disabled={uploading || !user || !isStepValid()}
                  className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-fuchsia-600 to-rose-600 text-white font-medium hover:brightness-110 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Create Business
                    </>
                  )}
        </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
