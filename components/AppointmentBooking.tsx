'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, User, Phone, Mail, X, CheckCircle } from 'lucide-react';

interface AppointmentBookingProps {
  businessId: number;
  businessName: string;
  businessPhone?: string;
  businessEmail?: string;
  className?: string;
}

export default function AppointmentBooking({ 
  businessId,
  businessName, 
  businessPhone, 
  businessEmail, 
  className = "" 
}: AppointmentBookingProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    service: '',
    message: ''
  });

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
  ];

  const serviceOptions = [
    'General Consultation',
    'Service Request',
    'Quote Request',
    'Meeting',
    'Other'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          business_id: businessId,
          ...formData
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSubmitted(true);
        
        // Reset form after showing success
        setTimeout(() => {
          setIsSubmitted(false);
          setIsOpen(false);
          setFormData({
            name: '',
            email: '',
            phone: '',
            date: '',
            time: '',
            service: '',
            message: ''
          });
        }, 3000);
      } else {
        setError(data.error || 'Failed to book appointment');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <>
      {/* Appointment Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className={`flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-fuchsia-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ${className}`}
      >
        <Calendar className="w-5 h-5" />
        <span className="font-medium">Book Appointment</span>
      </motion.button>

      {/* Appointment Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-rose-500 to-fuchsia-600 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">Book Appointment</h2>
                    <p className="text-sm opacity-90">{businessName}</p>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Success Message */}
              <AnimatePresence>
                {isSubmitted && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="p-6 text-center"
                  >
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      Appointment Requested!
                    </h3>
                    <p className="text-gray-600">
                      We've received your appointment request. {businessName} will contact you soon to confirm.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-4 bg-red-50 border border-red-200 rounded-lg mx-6 mt-4"
                  >
                    <p className="text-red-600 text-sm">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Appointment Form */}
              <AnimatePresence>
                {!isSubmitted && (
                  <motion.form
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="p-6 space-y-4"
                  >
                    {/* Personal Information */}
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          <User className="w-4 h-4 inline mr-1" />
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-rose-500"
                          placeholder="Your full name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          <Mail className="w-4 h-4 inline mr-1" />
                          Email *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-rose-500"
                          placeholder="your@email.com"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          <Phone className="w-4 h-4 inline mr-1" />
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-rose-500"
                          placeholder="(555) 123-4567"
                        />
                      </div>
                    </div>

                    {/* Appointment Details */}
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          <Calendar className="w-4 h-4 inline mr-1" />
                          Preferred Date *
                        </label>
                        <input
                          type="date"
                          name="date"
                          value={formData.date}
                          onChange={handleInputChange}
                          required
                          min={getMinDate()}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-rose-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          <Clock className="w-4 h-4 inline mr-1" />
                          Preferred Time *
                        </label>
                        <select
                          name="time"
                          value={formData.time}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-rose-500"
                        >
                          <option value="">Select a time</option>
                          {timeSlots.map(time => (
                            <option key={time} value={time}>{time}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Service Type *
                        </label>
                        <select
                          name="service"
                          value={formData.service}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-rose-500"
                        >
                          <option value="">Select a service</option>
                          {serviceOptions.map(service => (
                            <option key={service} value={service}>{service}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Additional Message
                        </label>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-rose-500"
                          placeholder="Tell us more about what you need..."
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <motion.button
                      type="submit"
                      disabled={isLoading}
                      whileHover={{ scale: isLoading ? 1 : 1.02 }}
                      whileTap={{ scale: isLoading ? 1 : 0.98 }}
                      className="w-full py-3 bg-gradient-to-r from-rose-500 to-fuchsia-600 text-white rounded-lg font-medium hover:from-rose-600 hover:to-fuchsia-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? 'Submitting...' : 'Request Appointment'}
                    </motion.button>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 