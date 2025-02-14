'use client';

export default function NewsTicker() {
  const news = [
    "Latest mobile phones and gadgets",
    "Exclusive deals on smartphones",
    "New technology updates",
    "Special offers on accessories"
  ];

  return (
    <div 
      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2.5 fixed w-full z-40 shadow-md" 
      style={{ top: '64px' }}
    >
      <div className="relative overflow-hidden">
        <div className="flex whitespace-nowrap animate-scroll">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex">
              {news.map((item, index) => (
                <span 
                  key={index} 
                  className="mx-8 text-sm font-medium text-white/90 flex items-center gap-2"
                >
                  <span className="text-white">📱</span>
                  <span className="hover:text-white transition-colors cursor-pointer">
                    {item}
                  </span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* Add this to your global CSS file */
