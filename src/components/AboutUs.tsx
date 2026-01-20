import React from 'react';
import { GraduationCap, Database, Brain, Shield, Activity } from 'lucide-react';
import drAzlina from '../../Dr Azlina.jpeg';
import profVoon from '../../Prof Voon.jpg';
import shafizal from '../../shafizal.jpeg';
import jeffrey from '../../JeffreyJee.jpg';


const AboutUs: React.FC = () => {
  const teamMembers = [
    {
      id: 1,
      name: 'PROF.DR. VOON BOO HO',
      role: 'Researcher',
      description: 'Fakulti Pengurusan Perniagaan, UiTM Sarawak',
      image: profVoon, // Placeholder - replace with actual image
      icon: GraduationCap,
      expertise: ''
    },
    {
      id: 2,
      name: 'DR AZLINA BUJANG',
      role: 'Researcher',
      description: 'Fakulti Sains Komputer dan Matematik, UiTM Sarawak',
      image: drAzlina,
      icon: Database,
      expertise: ''
    },
    {
      id: 3,
      name: 'DR. JEFFREY JEE TECK WENG',
      role: 'Researcher',
      description: 'Swinburne University of Technology Sarawak',
      image: jeffrey , // Placeholder - replace with actual image
      icon: Brain,
      expertise: ''
    },
    {
      id: 4,
      name: 'MUHAMAD NORSHAFIZAL',
      role: 'Research Assistant',
      description: 'Fakulti Sains Komputer dan Matematik, UiTM Jasin',
      image: shafizal, // Placeholder - replace with actual image
      icon: Activity,
      expertise: ''
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50/20 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Introduction Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-6">
            <Shield className="h-6 w-6 text-[#CE1126]" />
            <h1 className="text-4xl font-semibold text-gray-900" style={{ 
              letterSpacing: '0.2px',
              lineHeight: '1.2'
            }}>
              About RehabServE
            </h1>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-700 leading-relaxed mb-6" style={{
              lineHeight: '1.7',
              letterSpacing: '0.1px'
            }}>
              RehabServE is an intelligent, data-driven rehabilitation service excellence platform developed to support rehabilitation centres in monitoring performance, improving patient outcomes, and enabling evidence-based decision-making through advanced analytics and artificial intelligence.
            </p>
            
            <p className="text-base text-gray-600 leading-relaxed" style={{
              lineHeight: '1.6',
              letterSpacing: '0.1px'
            }}>
              The platform integrates clinical performance metrics, patient outcome data, and organizational analytics to provide rehabilitation professionals with actionable insights for service enhancement and quality improvement initiatives.
            </p>
          </div>
        </div>

        {/* Research & Development Team Section */}
        <div className="mb-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-gray-900 mb-3" style={{ 
              letterSpacing: '0.1px',
              lineHeight: '1.3'
            }}>
              Research & Development Team
            </h2>
            <p className="text-base text-gray-600 max-w-2xl mx-auto" style={{
              lineHeight: '1.6',
              letterSpacing: '0.1px'
            }}>
Our research team integrates knowledge in healthcare systems and rehabilitation studies to contribute to high-quality rehabilitation service development.            </p>
          </div>

          {/* Team Members Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {teamMembers.map((member) => {
              return (
                <div
                  key={member.id}
                  className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300"
                  style={{
                    boxShadow: '0 4px 12px rgba(15, 76, 129, 0.06)'
                  }}
                >
                  {/* Portrait Image */}
                  <div className="mb-5 flex justify-center">
                    <div className="relative">
                      <div className="w-40 h-40 rounded-full bg-gradient-to-br from-[#CE1126]/10 to-[#FCD106]/10 flex items-center justify-center border-4 border-white overflow-hidden"
                        style={{
                          boxShadow: '0 4px 12px rgba(15, 76, 129, 0.12)'
                        }}
                      >
                        {member.image ? (
                          <img
                            src={member.image}
                            alt={member.name || 'Team member'}
                            className="w-full h-full object-cover block"
                            onError={(e) => {
                              // If image fails, hide broken image
                              const img = e.currentTarget;
                              img.style.display = 'none';
                            }}
                          />
                        ) : null}
                      </div>
                    </div>
                  </div>

                  {/* Name */}
                  {member.name && (
                    <h3 className="text-xl font-semibold text-gray-900 text-center mb-2" style={{
                      letterSpacing: '0.1px',
                      lineHeight: '1.3'
                    }}>
                      {member.name}
                    </h3>
                  )}

                  {/* Role */}
                  {member.role && (
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#1F6E8C]/30 to-transparent"></div>
                      <p className="text-sm font-medium text-[#1F6E8C] px-3" style={{
                        letterSpacing: '0.1px'
                      }}>
                        {member.role}
                      </p>
                      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#1F6E8C]/30 to-transparent"></div>
                    </div>
                  )}

                  {/* Expertise Badge */}
                  {member.expertise && (
                    <div className="flex justify-center mb-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#FCD106]/10 text-[#FCD106] border border-[#FCD106]/20">
                        {member.expertise}
                      </span>
                    </div>
                  )}

                  {/* Description */}
                  {member.description && (
                    <p className="text-sm text-gray-600 leading-relaxed text-center" style={{
                      lineHeight: '1.6',
                      letterSpacing: '0.1px'
                    }}>
                      {member.description}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Platform Features Section */}
        <div className="mt-16 pt-12 border-t border-gray-200">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-semibold text-gray-900 text-center mb-8" style={{
              letterSpacing: '0.1px',
              lineHeight: '1.3'
            }}>
              Platform Capabilities
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/60 backdrop-blur-sm rounded-lg p-5 border border-gray-200">
                <h4 className="text-base font-semibold text-gray-900 mb-2" style={{ letterSpacing: '0.1px' }}>
                  Performance Monitoring
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed" style={{
                  lineHeight: '1.6',
                  letterSpacing: '0.1px'
                }}>
                  Comprehensive tracking of rehabilitation service metrics, dimension scores, and organizational performance indicators.
                </p>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-lg p-5 border border-gray-200">
                <h4 className="text-base font-semibold text-gray-900 mb-2" style={{ letterSpacing: '0.1px' }}>
                  Evidence-Based Analytics
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed" style={{
                  lineHeight: '1.6',
                  letterSpacing: '0.1px'
                }}>
                  Advanced data analysis and statistical modeling to identify trends, strengths, and areas for improvement.
                </p>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-lg p-5 border border-gray-200">
                <h4 className="text-base font-semibold text-gray-900 mb-2" style={{ letterSpacing: '0.1px' }}>
                  Intelligent Decision Support
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed" style={{
                  lineHeight: '1.6',
                  letterSpacing: '0.1px'
                }}>
                  AI-powered insights and recommendations to support clinical decision-making and service enhancement strategies.
                </p>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-lg p-5 border border-gray-200">
                <h4 className="text-base font-semibold text-gray-900 mb-2" style={{ letterSpacing: '0.1px' }}>
                  Secure & Compliant
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed" style={{
                  lineHeight: '1.6',
                  letterSpacing: '0.1px'
                }}>
                  Clinical-grade security measures and compliance with healthcare data privacy standards and regulations.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Academic Note */}
        <div className="mt-16 pt-8 text-center">
          <p className="text-sm text-gray-500 leading-relaxed max-w-3xl mx-auto" style={{
            lineHeight: '1.6',
            letterSpacing: '0.1px'
          }}>
            RehabServE is developed as part of ongoing research initiatives in rehabilitation service excellence and healthcare analytics. The platform is designed for deployment in clinical environments, academic institutions, and rehabilitation centres.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
