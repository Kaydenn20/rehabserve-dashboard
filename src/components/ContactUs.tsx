import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const ContactUs: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatus('error');
      return;
    }
    setStatus('sending');
    // Simulate submit
    setTimeout(() => {
      setStatus('sent');
      setName('');
      setEmail('');
      setMessage('');
    }, 700);
  };

  return (
    <div className="min-h-screen bg-white">
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-gray-900">Contact Us</h2>
            <p className="text-lg text-gray-600 max-w-xl">
              We're here to help. Reach out with questions about our platform, partnerships, or support.
              We'll respond as soon as possible.
            </p>

            <div className="mt-6 grid gap-4">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-[#F3F4F6] rounded-lg">
                  <MapPin className="h-5 w-5 text-[#CE1126]" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-medium text-gray-900">123 RehabServE Drive, City, Country</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-[#F3F4F6] rounded-lg">
                  <Phone className="h-5 w-5 text-[#CE1126]" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium text-gray-900">+60 12-345 6789</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-[#F3F4F6] rounded-lg">
                  <Mail className="h-5 w-5 text-[#CE1126]" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-900">support@rehabserve.example</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-[#F3F4F6] rounded-lg">
                  <Clock className="h-5 w-5 text-[#CE1126]" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Hours</p>
                  <p className="font-medium text-gray-900">Mon - Fri, 9:00 AM - 6:00 PM</p>
                </div>
              </div>
            </div>

            {/* Map placeholder */}
            <div className="mt-6 rounded-xl overflow-hidden shadow-lg">
              <img
                src="https://via.placeholder.com/800x400?text=Map+Placeholder"
                alt="Map"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          <div className="bg-gray-50 p-8 rounded-2xl shadow-lg">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Send us a message</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your name</label>
                <input
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#CE1126]/30"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#CE1126]/30"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#CE1126]/30 h-32"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we help?"
                />
              </div>

              {status === 'error' && (
                <div className="text-sm text-red-600">Please fill in all fields.</div>
              )}

              <div className="flex items-center justify-between gap-4">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-[#CE1126] to-[#FCD106] text-white font-semibold px-6 py-3 rounded-lg shadow"
                >
                  {status === 'sending' ? 'Sending...' : 'Send Message'}
                </button>
                {status === 'sent' && <div className="text-sm text-green-600">Message sent — we'll be in touch.</div>}
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;


