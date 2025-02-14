'use client';
import { useState } from 'react';
import { Mail, Users, Globe2, MessageSquare, Send, ThumbsUp, Eye, Share2 } from 'lucide-react';

export default function Contact({ isSidebarOpen }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className={`bg-gray-50 min-h-screen transition-all duration-300 ${isSidebarOpen ? 'ml-0 md:ml-56' : 'ml-0'}`}>
      {/* Hero Section */}
      <section className="relative h-64 bg-gradient-to-r from-blue-900 to-indigo-900">
        <div className="absolute inset-0">
          <div className="h-full flex items-center justify-center px-4">
            <div className="text-center max-w-4xl">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Contact Device Decode
              </h1>
              <p className="text-lg text-white/90">
                Your trusted source for honest tech reviews and insights from around the world
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow duration-300">
            <Globe2 className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Global Reach</h3>
            <p className="text-3xl font-bold text-blue-600 mb-2">150+</p>
            <p className="text-gray-600">Countries with active readers</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow duration-300">
            <Eye className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Monthly Views</h3>
            <p className="text-3xl font-bold text-blue-600 mb-2">2M+</p>
            <p className="text-gray-600">Readers trust our reviews</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow duration-300">
            <ThumbsUp className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">User Ratings</h3>
            <p className="text-3xl font-bold text-blue-600 mb-2">50K+</p>
            <p className="text-gray-600">Community interactions</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Get in Touch</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div className="text-center">
                <button
                  type="submit"
                  className="inline-flex items-center px-8 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-300"
                >
                  <Send className="w-5 h-5 mr-2" />
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-16">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <MessageSquare className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600">Common questions about Device Decode's review platform</p>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-xl font-bold text-gray-900 mb-2">How do you conduct your reviews?</h3>
              <p className="text-gray-600">Our reviews are based on real-world usage and comprehensive testing. We gather data from users worldwide and combine it with our expert analysis to provide unbiased, detailed reviews.</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Can I contribute my user experience?</h3>
              <p className="text-gray-600">Yes! We welcome user reviews and experiences. You can comment on our reviews or submit your detailed user experience through our community section.</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-xl font-bold text-gray-900 mb-2">How can I stay updated with new reviews?</h3>
              <p className="text-gray-600">Subscribe to our newsletter, follow us on social media, or enable notifications to stay updated with our latest reviews and tech insights.</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Do you accept guest posts or collaborations?</h3>
              <p className="text-gray-600">We welcome collaborations with tech enthusiasts and experts. Contact us with your expertise and ideas for potential partnerships.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">Connect With Our Community</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <Share2 className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Share Your Experience</h3>
              <p className="text-gray-600">Join discussions and share your device experiences</p>
            </div>
            <div className="flex flex-col items-center">
              <Users className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Global Community</h3>
              <p className="text-gray-600">Connect with tech enthusiasts worldwide</p>
            </div>
            <div className="flex flex-col items-center">
              <Mail className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Stay Updated</h3>
              <p className="text-gray-600">Subscribe for the latest reviews and insights</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}