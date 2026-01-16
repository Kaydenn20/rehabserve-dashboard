import React from 'react';
import { Grid3x3, Minus, Heart, Target, Award, Code } from 'lucide-react';
import drAzlina from '../../Dr Azlina.jpeg';

const AboutUs: React.FC = () => {

  return (
    <div className="min-h-screen bg-white">
      {/* Vision and Mission Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Side - Images */}
            <div className="space-y-6">
              <div className="relative">
                <div className="aspect-square rounded-full overflow-hidden shadow-lg border-4 border-white">
                  <img 
                    src="https://via.placeholder.com/400x400?text=RehabServE+Facility" 
                    alt="RehabServE Facility" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square rounded-full overflow-hidden shadow-lg border-4 border-white">
                  <img 
                    src="https://via.placeholder.com/400x400?text=Rehabilitation+Technology" 
                    alt="Rehabilitation Technology" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Right Side - Vision and Mission */}
            <div className="space-y-12">
              {/* Vision */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-gradient-to-br from-[#CE1126] to-[#FCD106] rounded-lg">
                    <Grid3x3 className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Our Vision</h2>
                </div>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Spearheading health & rehabilitation services to enhance people's wellbeing globally through innovative technology and compassionate care.
                </p>
              </div>

              {/* Mission */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-gradient-to-br from-[#CE1126] to-[#FCD106] rounded-lg">
                    <Minus className="h-6 w-6 text-white rotate-90" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Our Mission</h2>
                </div>
                <p className="text-lg text-gray-700 leading-relaxed">
                  We are committed to helping people live life to the fullest while leading the way in uplifting medical standards through data-driven insights and evidence-based rehabilitation practices.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CEO Greeting Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Side - CEO Image */}
            <div className="flex justify-center md:justify-start">
              <div className="relative">
                <div className="w-64 h-80 rounded-lg overflow-hidden shadow-2xl border-4 border-white/20">
                  <img 
                    src={drAzlina} 
                    alt="CEO" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-white px-6 py-3 rounded-lg shadow-lg border-2 border-[#CE1126]">
                  <p className="font-bold text-gray-900 text-center">Dr Azlina Binti Bujang</p>
                  <p className="text-sm text-gray-600 text-center">CEO</p>
                </div>
              </div>
            </div>

            {/* Right Side - Greeting Message */}
            <div className="text-white space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Greetings to a Healthier You!</h2>
              <div className="space-y-4 text-lg leading-relaxed">
                <p>
                  Welcome to RehabServE, where we believe in empowering rehabilitation centres with cutting-edge technology and data-driven insights.
                </p>
                <p>
                  Our platform is designed to help healthcare professionals deliver exceptional care through comprehensive analytics, AI-powered insights, and evidence-based practices. We are committed to making a positive difference in the lives of those we serve.
                </p>
                <p>
                  At RehabServE, we understand that every patient's journey is unique. That's why we've built a platform that provides personalized insights and supports multidisciplinary teams in delivering the highest quality of care.
                </p>
              </div>
              <div className="flex items-center gap-2 pt-4">
                <Heart className="h-5 w-5 text-[#FCD106]" />
                <p className="font-semibold">Dr Azlina Binti Bujang, Researcher</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Developer Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-gradient-to-br from-[#CE1126] to-[#FCD106] rounded-full">
                <Code className="h-8 w-8 text-white" />
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Developer</h2>
            <p className="text-lg text-gray-600">The creative mind behind RehabServE</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-200">
            <div className="text-center space-y-6">
              <div className="w-48 h-48 mx-auto rounded-full overflow-hidden shadow-lg border-4 border-gray-200">
                <img 
                  src="https://via.placeholder.com/200x200?text=Developer+Photo" 
                  alt="Developer" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900">Muhamad Norshafizal Bin Saaet</h3>
                <p className="text-lg text-gray-600 font-medium">Developer</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-12">Our Core Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-lg text-center space-y-4">
              <div className="flex justify-center">
                <div className="p-4 bg-[#CE1126]/10 rounded-full">
                  <Heart className="h-8 w-8 text-[#CE1126]" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Compassion</h3>
              <p className="text-gray-600">
                We approach every patient and healthcare professional with empathy and understanding.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg text-center space-y-4">
              <div className="flex justify-center">
                <div className="p-4 bg-[#FCD106]/20 rounded-full">
                  <Target className="h-8 w-8 text-[#FCD106]" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Excellence</h3>
              <p className="text-gray-600">
                We strive for the highest standards in everything we do, from technology to care delivery.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg text-center space-y-4">
              <div className="flex justify-center">
                <div className="p-4 bg-blue-100 rounded-full">
                  <Award className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Innovation</h3>
              <p className="text-gray-600">
                We leverage cutting-edge technology and AI to drive better outcomes and experiences.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;


