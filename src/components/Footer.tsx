import React from 'react';
import { Shield, Lock, FileText, Clock, Mail } from 'lucide-react';

interface FooterProps {
  onNavClick?: (section: 'home' | 'about' | 'contact') => void;
  withSidebarMargin?: boolean; // For dashboard page with sidebar
}

const Footer: React.FC<FooterProps> = ({ onNavClick, withSidebarMargin = false }) => {
  const currentYear = new Date().getFullYear();

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, section?: 'home' | 'about' | 'contact') => {
    if (section && onNavClick) {
      e.preventDefault();
      onNavClick(section);
    }
  };

  return (
    <footer className={`bg-gray-50 border-t border-gray-200 mt-auto ${withSidebarMargin ? 'lg:ml-64' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4" style={{ letterSpacing: '0.1px' }}>
              Quick Links
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  onClick={(e) => handleLinkClick(e, 'home')}
                  className="text-sm text-gray-600 hover:text-[#CE1126] transition-colors duration-200"
                  style={{ letterSpacing: '0.1px' }}
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  onClick={(e) => handleLinkClick(e, 'about')}
                  className="text-sm text-gray-600 hover:text-[#CE1126] transition-colors duration-200"
                  style={{ letterSpacing: '0.1px' }}
                >
                  About RehabServE
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  onClick={(e) => handleLinkClick(e, 'contact')}
                  className="text-sm text-gray-600 hover:text-[#CE1126] transition-colors duration-200"
                  style={{ letterSpacing: '0.1px' }}
                >
                  Contact Support
                </a>
              </li>
            </ul>
          </div>

          {/* Support & Compliance */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4" style={{ letterSpacing: '0.1px' }}>
              Support & Compliance
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#privacy"
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#CE1126] transition-colors duration-200"
                  style={{ letterSpacing: '0.1px' }}
                >
                  <Lock className="h-3.5 w-3.5 text-[#CE1126]" />
                  <span>Data Privacy Policy</span>
                </a>
              </li>
              <li>
                <a
                  href="#security"
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#CE1126] transition-colors duration-200"
                  style={{ letterSpacing: '0.1px' }}
                >
                  <Shield className="h-3.5 w-3.5 text-[#CE1126]" />
                  <span>Security & Confidentiality</span>
                </a>
              </li>
              <li>
                <a
                  href="#guidelines"
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#CE1126] transition-colors duration-200"
                  style={{ letterSpacing: '0.1px' }}
                >
                  <FileText className="h-3.5 w-3.5 text-[#CE1126]" />
                  <span>System Access Guidelines</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4" style={{ letterSpacing: '0.1px' }}>
              Contact Information
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:support@rehabserve.utm.my"
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#CE1126] transition-colors duration-200"
                  style={{ letterSpacing: '0.1px' }}
                >
                  <Mail className="h-3.5 w-3.5 flex-shrink-0 text-[#CE1126]" />
                  vooboonho@gmail.com<br />
                  shaf8948@gmail.com<br />
                </a>
              </li>
              <li>
                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <Clock className="h-3.5 w-3.5 flex-shrink-0 mt-0.5 text-[#CE1126]" />
                  <div>
                    <p className="font-medium mb-1">Operating Hours</p>
                    <p className="text-xs" style={{ lineHeight: '1.5' }}>
                      Monday - Friday: 8:00 AM - 5:00 PM<br />
                      Saturday - Sunday: Closed
                    </p>
                  </div>
                </div>
              </li>
              <li className="pt-2">
                <p className="text-xs text-gray-500 leading-relaxed" style={{
                  lineHeight: '1.5',
                  letterSpacing: '0.1px'
                }}>
                  For system access issues, please contact your system administrator.
                </p>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-500 text-center md:text-left" style={{ letterSpacing: '0.1px' }}>
              © {currentYear} RehabServE. All rights reserved. | Rehabilitation Service Excellence Platform
            </p>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1.5">
                <Shield className="h-3 w-3 text-[#CE1126]" />
                <span>HIPAA Compliant</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Lock className="h-3 w-3 text-[#CE1126]" />
                <span>Secure Access</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
