// NewsTicker.js
'use client';

export default function NewsTicker() {
  const news = [
    "Latest mobile phones and gadgets",
    "Exclusive deals on smartphones",
    "New technology updates",
    "Special offers on accessories"
  ];

  return (
    <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 fixed w-full z-40" style={{ top: '64px' }}>
      <div className="relative overflow-hidden">
        <div className="flex whitespace-nowrap animate-scroll">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex">
              {news.map((item, index) => (
                <span key={index} className="mx-8 text-sm font-medium">📱 {item}</span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}