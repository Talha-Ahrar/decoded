import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube, Smartphone, Newspaper, BarChart2 } from 'lucide-react';

export default function Footer({ isSidebarOpen, isMobile }) {
  const footerLinks = {
    phones: [
      { name: 'Compare Phones', href: '/compare' },
      { name: 'Latest Reviews', href: '/reviews' },
      { name: 'Upcoming Phones', href: '/upcoming' },
      { name: 'Price Tracker', href: '/price-tracker' },
      { name: 'Phone Specs', href: '/specifications' }
    ],
    news: [
      { name: 'Tech News', href: '/news' },
      { name: 'Mobile News', href: '/mobile-news' },
      { name: 'Gadget Reviews', href: '/gadget-reviews' },
      { name: 'Trending Articles', href: '/trending' },
      { name: 'Industry Updates', href: '/updates' }
    ],
    comparisons: [
      { name: 'Side by Side Compare', href: '/side-by-side' },
      { name: 'Camera Comparison', href: '/camera-compare' },
      { name: 'Performance Tests', href: '/benchmarks' },
      { name: 'Battery Life Tests', href: '/battery-tests' },
      { name: 'Value for Money', href: '/value-compare' }
    ],
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Contact', href: '/contact' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Cookie Policy', href: '/cookies' }
    ]
  };

  return (
    <footer className={`bg-gradient-to-r from-blue-900 to-indigo-900 text-white transition-all duration-300 
      ${isSidebarOpen && !isMobile ? 'md:ml-56' : 'ml-0'}`}>
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="col-span-1 sm:col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Smartphone className="w-6 h-6 text-blue-400" />
              <h3 className="text-xl font-bold">Infomatic</h3>
            </div>
            <p className="text-blue-100/80 text-sm mb-6">
              Your comprehensive resource for mobile technology, comparisons, and the latest tech news.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-blue-100/80 hover:text-blue-400 transition-colors">
                <Facebook className="w-5 h-5" />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="text-blue-100/80 hover:text-blue-400 transition-colors">
                <Twitter className="w-5 h-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-blue-100/80 hover:text-blue-400 transition-colors">
                <Instagram className="w-5 h-5" />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="#" className="text-blue-100/80 hover:text-blue-400 transition-colors">
                <Youtube className="w-5 h-5" />
                <span className="sr-only">YouTube</span>
              </a>
            </div>
          </div>

          {/* Quick Links Sections */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Smartphone className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-semibold">Phones</h3>
            </div>
            <ul className="space-y-2">
              {footerLinks.phones.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-blue-100/80 hover:text-blue-400 text-sm transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4">
              <Newspaper className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-semibold">News</h3>
            </div>
            <ul className="space-y-2">
              {footerLinks.news.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-blue-100/80 hover:text-blue-400 text-sm transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4">
              <BarChart2 className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-semibold">Comparisons</h3>
            </div>
            <ul className="space-y-2">
              {footerLinks.comparisons.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-blue-100/80 hover:text-blue-400 text-sm transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Section */}
          <div className="col-span-1 sm:col-span-2 md:col-span-1">
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-blue-100/80 text-sm">
                <Mail className="w-4 h-4 text-blue-400" />
                info@infomatic.com
              </li>
              <li className="flex items-center gap-2 text-blue-100/80 text-sm">
                <Phone className="w-4 h-4 text-blue-400" />
                +1 (555) 123-4567
              </li>
              <li className="flex items-center gap-2 text-blue-100/80 text-sm">
                <MapPin className="w-4 h-4 text-blue-400" />
                123 Tech Street, Digital City
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-blue-400/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-blue-100/80 text-sm text-center md:text-left">
              &copy; {new Date().getFullYear()} Infomatic. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              {footerLinks.company.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="text-blue-100/80 hover:text-blue-400 text-sm transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}