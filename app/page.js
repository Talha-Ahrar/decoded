// app/page.js
import ImageSlider from '@/components/ImageSlider'

export default function Home() {
  const images = [
    'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80'
  ];

  return (
    <div > {/* Adjusted padding for navbar + news ticker */}
      <section className="py-4 md:py-8">
        <ImageSlider images={images} />
      </section>
      
      {/* Add more sections here for responsive content */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Featured products/content */}
        </div>
      </section>
    </div>
  );
}
