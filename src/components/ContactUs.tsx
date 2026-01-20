import React, { useState } from 'react';
import { Mail, Clock, Shield, Lock, Headphones, Send, AlertCircle } from 'lucide-react';
import emailjs from '@emailjs/browser';

const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    organization: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    // EmailJS configuration
    const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_pba4bko';
    const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_zzw3814';
    const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'TzgED9KNV4HygcjHP';

    // Prepare email template parameters
    const templateParams = {
      from_name: formData.name,
      from_email: formData.email,
      organization: formData.organization,
      message: formData.message,
      to_email: 'rehabserve.care@gmail.com', // Your email address
      reply_to: formData.email,
    };

    try {
      // Send email using EmailJS
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        templateParams,
        PUBLIC_KEY
      );

      // Success
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({
        name: '',
        organization: '',
        email: '',
        message: ''
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);
    } catch (error) {
      // Error handling
      console.error('Email sending failed:', error);
      setIsSubmitting(false);
      setSubmitStatus('error');
      
      // Reset error message after 5 seconds
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50/20 py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-6">
            <Headphones className="h-6 w-6 text-[#CE1126]" />
            <h1 className="text-4xl font-semibold text-gray-900" style={{ 
              letterSpacing: '0.2px',
              lineHeight: '1.2'
            }}>
              Contact Support
            </h1>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <p className="text-base text-gray-700 leading-relaxed" style={{
              lineHeight: '1.7',
              letterSpacing: '0.1px'
            }}>
              Our support channel is available to assist authorized users with system access, dashboard usage, data interpretation, and technical issues. Please use the form below to submit your inquiry, and our support team will respond during operating hours.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-10">
          {/* Left Column - Support Information */}
          <div className="lg:col-span-1 space-y-6">
            {/* Support Contact Information */}
            <div className="bg-white rounded-xl border border-gray-200 p-6" style={{
              boxShadow: '0 4px 12px rgba(15, 76, 129, 0.06)'
            }}>
              <h2 className="text-xl font-semibold text-gray-900 mb-6" style={{
                letterSpacing: '0.1px',
                lineHeight: '1.3'
              }}>
                Support Contact Information
              </h2>

              <div className="space-y-5">
                {/* Email */}
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[#CE1126]/10 rounded-lg flex-shrink-0">
                    <Mail className="h-5 w-5 text-[#CE1126]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-1" style={{ letterSpacing: '0.1px' }}>
                      Support Email
                    </h3>
                    <a 
                      href="mailto:rehabserve.care@gmail.com"
                      className="text-sm text-[#CE1126] hover:text-[#CE1126]/80 transition-colors"
                      style={{ letterSpacing: '0.1px' }}
                    >
                      rehabserve.care@gmail.com
                      voonbooho@gmail.com
                    </a>
                  </div>
                </div>

                {/* Operating Hours */}
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[#4CAF50]/10 rounded-lg flex-shrink-0">
                    <Clock className="h-5 w-5 text-[#4CAF50]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-1" style={{ letterSpacing: '0.1px' }}>
                      Operating Hours
                    </h3>
                    <div className="text-sm text-gray-600 space-y-1" style={{
                      lineHeight: '1.5',
                      letterSpacing: '0.1px'
                    }}>
                      <p>Monday - Friday: 8:00 AM - 5:00 PM</p>
                      <p>Saturday - Sunday: Closed</p>
                    </div>
                  </div>
                </div>

                {/* Response Time */}
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500 leading-relaxed" style={{
                    lineHeight: '1.6',
                    letterSpacing: '0.1px'
                  }}>
                    Response time: Within 24-48 hours during operating hours. Urgent system access issues may receive priority response.
                  </p>
                </div>
              </div>
            </div>

            {/* System & Security Notice */}
            <div className="bg-gradient-to-br from-[#CE1126]/5 to-[#FCD106]/5 rounded-xl border border-[#CE1126]/20 p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="p-2 bg-[#CE1126]/10 rounded-lg flex-shrink-0">
                  <Shield className="h-5 w-5 text-[#CE1126]" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-2" style={{ letterSpacing: '0.1px' }}>
                    System & Security Notice
                  </h3>
                  <div className="space-y-3 text-sm text-gray-700 leading-relaxed" style={{
                    lineHeight: '1.6',
                    letterSpacing: '0.1px'
                  }}>
                    <p>
                      Support services are limited to authorized users with valid system access credentials.
                    </p>
                    <p>
                      All communications and data are handled in strict accordance with healthcare data privacy standards. Confidentiality and security are maintained throughout all support interactions.
                    </p>
                    <div className="flex items-start gap-2 pt-2">
                      <Lock className="h-4 w-4 text-[#1F6E8C] flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-gray-600">
                        For system access issues, please contact your system administrator or use your assigned PDK access code.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Support Request Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 p-8" style={{
              boxShadow: '0 4px 12px rgba(15, 76, 129, 0.06)'
            }}>
              <h2 className="text-xl font-semibold text-gray-900 mb-6" style={{
                letterSpacing: '0.1px',
                lineHeight: '1.3'
              }}>
                Support Request Form
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name */}
                <div>
                  <label 
                    htmlFor="name" 
                    className="block text-sm font-semibold text-gray-700 mb-2"
                    style={{ letterSpacing: '0.1px' }}
                  >
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CE1126] focus:border-[#CE1126] transition-all text-gray-900 placeholder-gray-400 bg-white"
                    placeholder="Enter your full name"
                    style={{ letterSpacing: '0.1px' }}
                  />
                </div>

                {/* Organization */}
                <div>
                  <label 
                    htmlFor="organization" 
                    className="block text-sm font-semibold text-gray-700 mb-2"
                    style={{ letterSpacing: '0.1px' }}
                  >
                    Organization / Rehabilitation Centre <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="organization"
                    name="organization"
                    type="text"
                    required
                    value={formData.organization}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CE1126] focus:border-[#CE1126] transition-all text-gray-900 placeholder-gray-400 bg-white"
                    placeholder="Enter your organization or centre name"
                    style={{ letterSpacing: '0.1px' }}
                  />
                </div>

                {/* Email */}
                <div>
                  <label 
                    htmlFor="email" 
                    className="block text-sm font-semibold text-gray-700 mb-2"
                    style={{ letterSpacing: '0.1px' }}
                  >
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CE1126] focus:border-[#CE1126] transition-all text-gray-900 placeholder-gray-400 bg-white"
                    placeholder="your.email@example.com"
                    style={{ letterSpacing: '0.1px' }}
                  />
                </div>

                {/* Message */}
                <div>
                  <label 
                    htmlFor="message" 
                    className="block text-sm font-semibold text-gray-700 mb-2"
                    style={{ letterSpacing: '0.1px' }}
                  >
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F6E8C] focus:border-[#1F6E8C] transition-all text-gray-900 placeholder-gray-400 bg-white resize-none"
                    placeholder="Please provide details about your inquiry or issue..."
                    style={{ 
                      letterSpacing: '0.1px',
                      lineHeight: '1.6'
                    }}
                  />
                </div>

                {/* Success/Error Messages */}
                {submitStatus === 'success' && (
                  <div className="flex items-start gap-2 p-4 bg-[#FCD106]/10 border border-[#FCD106]/30 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-[#FCD106] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-[#FCD106] mb-1">Request Submitted Successfully</p>
                      <p className="text-xs text-gray-600" style={{ letterSpacing: '0.1px' }}>
                        Your support request has been received. Our team will respond within 24-48 hours during operating hours.
                      </p>
                    </div>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="flex items-start gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-red-800 mb-1">Submission Failed</p>
                      <p className="text-xs text-red-700" style={{ letterSpacing: '0.1px' }}>
                        There was an error sending your request. Please try again or contact us directly at support@rehabserve.utm.my
                      </p>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full text-white font-semibold py-3.5 px-6 rounded-lg hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#CE1126] focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:scale-[1.01] transform duration-200 flex items-center justify-center gap-2"
                  style={{
                    background: 'linear-gradient(90deg, #CE1126, #FCD106)'
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      <span>Submit Support Request</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
