'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import NewsTicker from './NewsTicker';

export default function Navbar({ onMenuClick }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg' : 'bg-gradient-to-r from-purple-600 to-indigo-600'
      }`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={onMenuClick}
                className="p-2 rounded-lg text-white hover:bg-white/20 transition-colors"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <Link href="/" className="flex items-center">
                <img src="/3.png" alt="Logo" className="h-10 w-auto" />
              </Link>
            </div>

            <div className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-white hover:text-purple-200 text-sm font-medium transition-colors">Home</Link>
              <Link href="/about" className="text-white hover:text-purple-200 text-sm font-medium transition-colors">About</Link>
              <Link href="/services" className="text-white hover:text-purple-200 text-sm font-medium transition-colors">Services</Link>
              <Link href="/contact" className="text-white hover:text-purple-200 text-sm font-medium transition-colors">Contact</Link>
            </div>

            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-white hover:bg-white/20 transition-colors"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>
      <NewsTicker />
    </>
  );
}
