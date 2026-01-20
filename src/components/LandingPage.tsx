import React, { useState } from 'react';
import { Shield, AlertCircle, ArrowRight, Lock, Activity, CheckCircle2, Building2 } from 'lucide-react';
import rehabServeLogo from '../../RehabServELogo2.png';
import AboutUs from './AboutUs';
import ContactUs from './ContactUs';
import Footer from './Footer';

interface LandingPageProps {
  onAccessGranted: (pdkCode: string, isAdmin?: boolean) => void;
}

// Admin Access Code
const ADMIN_ACCESS_CODE = 'ADMIN-REHABSERVE-2025';

// PDK Access Code Mapping
// Format: ACCESS_CODE -> PDK_NAME (must match PDK_LIST values in App.tsx)
const PDK_ACCESS_CODES: { [key: string]: string } = {
  'JUL-PDK-01': 'PDK Julau',
  'BAU-PDK-01': 'PDK Bau',
  'BTK-PDK-01': 'PDK Batu Kawa',
  'BTG-PDK-01': 'PDK Betong',
  'BHL-PDK-01': 'PDK Borneo Highland',
  'KK-PDK-01': 'PDK KK',
  'MJM-PDK-01': 'PDK Morsjaya Miri',
  'NQS-PDK-01': 'PDK Nur Quseh Sibu',
  'PEN-PDK-01': 'PDK Penrissen',
  'PIB-PDK-01': 'PDK Pibalqis Miri',
  'PUT-PDK-01': 'PDK Putrajaya',
  'SDJ-PDK-01': 'PDK Sadong Jaya',
  'SRT-PDK-01': 'PDK Saratok',
  'SRK-PDK-01': 'PDK Sarikei',
  'SBJ-PDK-01': 'PDK Seberang Jaya',
  'SBY-PDK-01': 'PDK Sebuyau',
  'SKH-PDK-01': 'PDK Sentuhan Kasih Kuching',
  'SPT-PDK-01': 'PDK Sinar Putrajaya',
  'SAM-PDK-01': 'PDK Sri Aman',
  'SFM-PDK-01': 'PDK Sunflower Miri',
  'SGT-PDK-01': 'PDK Sungai Tiram',
  'TMP-PDK-01': 'PDK Tampaioli',
  'TUA-PDK-01': 'PDK Tuaran',
};

const LandingPage: React.FC<LandingPageProps> = ({ onAccessGranted }) => {
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentSection, setCurrentSection] = useState<'home' | 'about' | 'contact'>('home');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    // Trim and normalize the access code
    const normalizedCode = accessCode.trim().toUpperCase();

    // Validate access code
    if (!normalizedCode) {
      setError('Please enter a PDK access code.');
      setIsSubmitting(false);
      return;
    }

    // Check if admin access code
    if (normalizedCode === ADMIN_ACCESS_CODE) {
      // Store admin status in sessionStorage
      sessionStorage.setItem('isAdmin', 'true');
      sessionStorage.setItem('pdkAccessCode', normalizedCode);
      
      // Small delay for better UX
      setTimeout(() => {
        onAccessGranted('all', true);
        setIsSubmitting(false);
      }, 300);
      return;
    }

    // Check if access code exists in mapping
    const pdkName = PDK_ACCESS_CODES[normalizedCode];
    
    if (!pdkName) {
      setError('Invalid PDK code. Please try again.');
      setIsSubmitting(false);
      return;
    }

    // Store PDK in sessionStorage
    sessionStorage.setItem('assignedPDK', pdkName);
    sessionStorage.setItem('isAdmin', 'false');
    sessionStorage.setItem('pdkAccessCode', normalizedCode);

    // Small delay for better UX
    setTimeout(() => {
      onAccessGranted(pdkName, false);
      setIsSubmitting(false);
    }, 300);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccessCode(e.target.value);
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, section: 'home' | 'about' | 'contact') => {
    e.preventDefault();
    setCurrentSection(section);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isActive = (section: 'home' | 'about' | 'contact') => currentSection === section;

  const handleFooterNav = (section: 'home' | 'about' | 'contact') => {
    setCurrentSection(section);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const Navigation = () => (
    <nav className="w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center h-16">
          <div className="flex space-x-8">
            <a
              href="#"
              onClick={(e) => handleNavClick(e, 'home')}
              className={`font-medium transition-colors duration-200 ${
                isActive('home') ? 'text-[#CE1126]' : 'text-gray-700 hover:text-[#CE1126]'
              }`}
            >
              Home
            </a>
            <a
              href="#about"
              onClick={(e) => handleNavClick(e, 'about')}
              className={`font-medium transition-colors duration-200 ${
                isActive('about') ? 'text-[#CE1126]' : 'text-gray-700 hover:text-[#CE1126]'
              }`}
            >
              About RehabServE
            </a>
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, 'contact')}
              className={`font-medium transition-colors duration-200 ${
                isActive('contact') ? 'text-[#CE1126]' : 'text-gray-700 hover:text-[#CE1126]'
              }`}
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </nav>
  );

  if (currentSection === 'about') {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-white flex flex-col">
          <AboutUs />
          <Footer onNavClick={handleFooterNav} />
        </div>
      </>
    );
  }

  if (currentSection === 'contact') {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-white flex flex-col">
          <ContactUs />
          <Footer onNavClick={handleFooterNav} />
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-teal-50/30 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Subtle medical background pattern - very faint */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%231F6E8C' stroke-width='1'%3E%3Cpath d='M0 20h80M20 0v80M40 20h40M20 40h60M0 60h80M60 0v80'/%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="max-w-5xl w-full relative z-10">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left Side - Branding and Trust Elements */}
          <div className="text-center md:text-left space-y-6">
            <div className="flex justify-center mb-6">
              <img 
                src={rehabServeLogo} 
                alt="RehabServE Logo" 
                className="h-32 w-32 md:h-40 md:w-40 object-contain"
              />
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 leading-tight" style={{ 
                letterSpacing: '0.2px',
                lineHeight: '1.2'
              }}>
                RehabServE with AI
                <span className="block text-2xl md:text-3xl font-medium text-gray-700 mt-2" style={{
                  letterSpacing: '0.1px'
                }}>
                  Rehabilitation Service Excellence
                </span>
              </h1>
              
              <p className="text-base text-gray-700 leading-relaxed max-w-lg mx-auto md:mx-0" style={{
                lineHeight: '1.6',
                letterSpacing: '0.2px'
              }}>
                A secure analytics platform developed to assist rehabilitation centres in performance monitoring, patient outcome improvement, and service quality enhancement through data-driven insights.              </p>
            </div>

            {/* Medical Trust Indicators */}
            <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-6">
              <div className="flex items-center gap-2 text-sm text-gray-700 bg-white/60 backdrop-blur-sm px-3 py-2 rounded-lg border border-gray-200">
                <Building2 className="h-4 w-4 text-[#CE1126]" />
                <span>Designed for Rehabilitation Centres</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700 bg-white/60 backdrop-blur-sm px-3 py-2 rounded-lg border border-gray-200">
                <Shield className="h-4 w-4 text-[#1F6E8C]" />
                <span>Compliant with Clinical Data Privacy Standards</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700 bg-white/60 backdrop-blur-sm px-3 py-2 rounded-lg border border-gray-200">
                <Activity className="h-4 w-4 text-[#FCD106]" />
                <span>Evidence-Based Performance Monitoring</span>
              </div>
            </div>

            {/* Trust Badge Row */}
            <div className="flex flex-wrap gap-3 justify-center md:justify-start pt-4">
              <div className="flex items-center gap-1.5 text-xs text-gray-600">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#FCD106]" />
                <span>Research-grade Analytics</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-600">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#FCD106]" />
                <span>Secure & Confidential</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-600">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#FCD106]" />
                <span>Data-Driven Decision Support</span>
              </div>
            </div>
          </div>

          {/* Right Side - Access Form */}
          <div className="w-full max-w-md mx-auto">
            <div className="bg-white rounded-xl p-8 border border-[#E6EDF5]" style={{
              boxShadow: '0 8px 24px rgba(15, 76, 129, 0.08)'
            }}>
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2" style={{
                  letterSpacing: '0.1px'
                }}>
                  PDK Access Portal
                </h2>
                <p className="text-sm text-gray-600" style={{
                  lineHeight: '1.5',
                  letterSpacing: '0.1px'
                }}>
                  Enter your PDK access code to view your centre's performance data
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Access Code Input */}
                <div>
                  <label 
                    htmlFor="accessCode" 
                    className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2"
                  >
                    <Lock className="h-4 w-4 text-[#CE1126]" />
                    <span>PDK Access Code</span>
                  </label>
                  <input
                    id="accessCode"
                    type="text"
                    value={accessCode}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3.5 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all text-gray-900 placeholder-gray-400 ${
                      error
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50'
                        : 'border-gray-300 focus:ring-[#1F6E8C] focus:border-[#1F6E8C] bg-white hover:border-gray-400'
                    }`}
                    placeholder="Enter your access code"
                    autoFocus
                    disabled={isSubmitting}
                  />
                </div>

                {/* Error Message */}
                {error && (
                  <div className="flex items-start gap-2 text-red-600 text-sm bg-red-50 p-4 rounded-xl border border-red-200 animate-in fade-in">
                    <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
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
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <span>Access Dashboard</span>
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </button>
              </form>

              {/* Admin Note */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-xs text-center text-gray-500" style={{
                  letterSpacing: '0.1px'
                }}>
                  Admin access available with administrator credentials
                </p>
              </div>
            </div>

            {/* Footer Note */}
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500" style={{
                letterSpacing: '0.1px'
              }}>
                Need assistance? Contact your system administrator
              </p>
            </div>
            </div>
          </div>
        </div>
      </div>
      <Footer onNavClick={handleFooterNav} />
    </>
  );
};

export default LandingPage;

