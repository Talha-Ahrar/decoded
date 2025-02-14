'use client';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Smartphone, Newspaper, TrendingUp, Calendar } from 'lucide-react';

const AccessibleSlider = ({ slides, onSlideChange }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const goToSlide = (index) => {
    setCurrentIndex(index);
    onSlideChange(index);
  };

  const goToPrevious = () => {
    const newIndex = currentIndex === 0 ? slides.length - 1 : currentIndex - 1;
    goToSlide(newIndex);
  };

  const goToNext = () => {
    const newIndex = currentIndex === slides.length - 1 ? 0 : currentIndex + 1;
    goToSlide(newIndex);
  };

  useEffect(() => {
    let timer;
    if (isAutoPlaying) {
      timer = setInterval(goToNext, 5000);
    }
    return () => clearInterval(timer);
  }, [currentIndex, isAutoPlaying]);

  return (
    <div className="relative w-full h-96" role="region" aria-label="Featured Tech News">
      <div
        style={{
          backgroundImage: `url(${slides[currentIndex].image})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        }}
        className="h-full w-full transition-all duration-700 ease-in-out"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-indigo-900/80">
          <div className="h-full flex items-center justify-center px-4">
            <div className="text-center max-w-4xl">
              <span className="inline-block px-4 py-1 bg-blue-500/20 text-blue-200 rounded-full mb-4">
                {slides[currentIndex].category}
              </span>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
                {slides[currentIndex].title}
              </h1>
              <p className="text-lg text-white/90 mb-8">
                {slides[currentIndex].description}
              </p>
              <button className="px-6 py-3 bg-blue-500 text-white rounded-full font-medium hover:bg-blue-600 transition-colors duration-300">
                Read More
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`w-3 h-3 rounded-full transition-all duration-300 
                     ${currentIndex === index ? 'bg-blue-500 scale-125' : 'bg-white/50'}`}
          />
        ))}
      </div>

      <button
        onClick={goToPrevious}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 p-4 rounded-full backdrop-blur-sm"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>
      <button
        onClick={goToNext}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 p-4 rounded-full backdrop-blur-sm"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>
    </div>
  );
};

const NewsCard = ({ article }) => (
  <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
    <div
      style={{
        backgroundImage: `url(${article.image})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        height: '200px'
      }}
      className="w-full"
    />
    <div className="p-6">
      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm mb-4">
        {article.category}
      </span>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{article.title}</h3>
      <p className="text-gray-600 mb-4">{article.description}</p>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">{article.date}</span>
        <button className="text-blue-600 hover:text-blue-700 font-medium">Read More →</button>
      </div>
    </div>
  </div>
);

export default function Home({ isSidebarOpen }) {
  const heroSlides = [
    {
      image: '/api/placeholder/1920/1080',
      category: 'Latest Release',
      title: 'iPhone 15 Pro Max Review',
      description: 'Everything you need to know about Apples latest flagship device'
    },
    {
      image: '/api/placeholder/1920/1080',
      category: 'Tech News',
      title: 'The Future of Foldable Phones',
      description: 'How foldable technology is reshaping the mobile industry'
    },
    {
      image: '/api/placeholder/1920/1080',
      category: 'Comparison',
      title: 'Samsung S24 Ultra vs iPhone 15 Pro Max',
      description: 'Ultimate flagship showdown: Which one should you choose?'
    }
  ];

  const upcomingPhones = [
    {
      image: '/api/placeholder/800/600',
      title: 'Samsung Galaxy Z Fold 6',
      description: 'Expected to launch with revolutionary folding mechanism',
      date: 'Coming August 2025'
    },
    {
      image: '/api/placeholder/800/600',
      title: 'Google Pixel 9 Pro',
      description: 'Leaked specs reveal advanced AI capabilities',
      date: 'Expected October 2025'
    },
    {
      image: '/api/placeholder/800/600',
      title: 'OnePlus 13',
      description: 'Rumors suggest groundbreaking camera system',
      date: 'Coming Late 2025'
    }
  ];

  const trendingArticles = [
    {
      image: '/api/placeholder/800/600',
      category: 'Mobile',
      title: 'Why Battery Life Still Matters in 2025',
      description: 'The ongoing battle between performance and battery life',
      date: 'Feb 12, 2025'
    },
    {
      image: '/api/placeholder/800/600',
      category: 'Tech',
      title: 'The Rise of AI Smartphones',
      description: 'How artificial intelligence is changing mobile computing',
      date: 'Feb 13, 2025'
    },
    {
      image: '/api/placeholder/800/600',
      category: 'Review',
      title: 'Best Budget Phones of 2025',
      description: 'Top affordable smartphones that dont compromise on quality',
      date: 'Feb 14, 2025'
    }
  ];

  return (
    <div className={`min-h-screen ${isSidebarOpen && !isMobile ? 'md:ml-56' : 'ml-0'}`}> {/* Hero Section */}
      <section className="relative">
        <AccessibleSlider slides={heroSlides} onSlideChange={() => {}} />
      </section>

      {/* Upcoming Phones Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-center gap-2 mb-8">
          <Calendar className="w-6 h-6 text-blue-600" />
          <h2 className="text-3xl font-bold text-gray-900">Coming Soon</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {upcomingPhones.map((phone, index) => (
            <NewsCard key={index} article={phone} />
          ))}
        </div>
      </section>

      {/* Trending Articles Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-2 mb-8">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            <h2 className="text-3xl font-bold text-gray-900">Trending Articles</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trendingArticles.map((article, index) => (
              <NewsCard key={index} article={article} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-blue-900 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Stay Updated with Tech News
          </h2>
          <p className="text-blue-100 mb-8">
            Get the latest mobile news, reviews, and comparisons delivered to your inbox
          </p>
          <form className="flex flex-col md:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-3 rounded-full bg-white/10 text-white placeholder:text-blue-200 border border-blue-400/30 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button 
              type="submit"
              className="px-8 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-300"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}