'use client';
import { Award, Users, Globe2, Shield, Target, Sparkles, Clock, ThumbsUp } from 'lucide-react';

export default function About({ isSidebarOpen }) {
  const stats = [
    { icon: Users, label: 'Monthly Readers', value: '2M+' },
    { icon: Globe2, label: 'Countries', value: '150+' },
    { icon: ThumbsUp, label: 'Reviews', value: '1000+' },
    { icon: Clock, label: 'Years Experience', value: '5+' }
  ];

  const values = [
    {
      icon: Shield,
      title: 'Unbiased Reviews',
      description: 'Our reviews are always independent and free from manufacturer influence. We tell it like it is.'
    },
    {
      icon: Target,
      title: 'In-Depth Analysis',
      description: 'Every device undergoes thorough testing and real-world usage before we publish our findings.'
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'We incorporate user feedback and experiences to provide comprehensive device insights.'
    },
    {
      icon: Sparkles,
      title: 'Latest Technology',
      description: 'Staying ahead of tech trends to bring you the most current and relevant information.'
    }
  ];

  const team = [
    {
      image: '/api/placeholder/400/400',
      name: 'Alex Chen',
      role: 'Lead Tech Reviewer',
      description: '10+ years experience in mobile tech reviews'
    },
    {
      image: '/api/placeholder/400/400',
      name: 'Sarah Johnson',
      role: 'Camera Analysis Expert',
      description: 'Professional photographer & tech enthusiast'
    },
    {
      image: '/api/placeholder/400/400',
      name: 'Mike Rodriguez',
      role: 'Performance Analyst',
      description: 'Specializes in benchmarking & performance testing'
    }
  ];

  return (
    <div className={`bg-gray-50 min-h-screen transition-all duration-300 ${isSidebarOpen ? 'ml-0 md:ml-56' : 'ml-0'}`}>
      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-r from-blue-900 to-indigo-900">
        <div className="absolute inset-0">
          <div className="h-full flex items-center justify-center px-4">
            <div className="text-center max-w-4xl">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                About Device Decode
              </h1>
              <p className="text-xl text-white/90 mb-8">
                Your trusted source for in-depth tech reviews and device comparisons
              </p>
              <div className="flex items-center justify-center space-x-4">
                <Award className="w-12 h-12 text-blue-400" />
                <span className="text-white text-lg">Trusted by millions worldwide</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
          <p className="text-lg text-gray-600 mb-8">
            At Device Decode, we're passionate about helping you make informed decisions about technology. 
            We combine expert analysis with real-world testing to deliver honest, comprehensive reviews 
            that cut through the marketing hype and reveal the true value of today's devices.
          </p>
          <p className="text-lg text-gray-600">
            Our global community of tech enthusiasts contributes valuable insights and experiences, 
            making our reviews more comprehensive and representative of real-world usage.
          </p>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                <value.icon className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Review Process Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Review Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">1</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Thorough Testing</h3>
              <p className="text-gray-600">Comprehensive analysis of performance, features, and user experience</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">2</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Real-World Usage</h3>
              <p className="text-gray-600">Extended daily use to uncover practical benefits and limitations</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">3</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Community Input</h3>
              <p className="text-gray-600">Incorporating user experiences and feedback for balanced reviews</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
 

      {/* Join Community Section */}
      <section className="py-16 bg-blue-900">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Join Our Community</h2>
          <p className="text-xl text-blue-100 mb-8">
            Be part of our global tech community. Share your experiences, participate in discussions,
            and stay updated with the latest in tech.
          </p>
          <button className="px-8 py-3 bg-white text-blue-900 rounded-full font-medium hover:bg-blue-50 transition-colors duration-300">
            Get Started
          </button>
        </div>
      </section>
    </div>
  );
}