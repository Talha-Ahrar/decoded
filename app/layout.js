'use client';

import './globals.css';
import { Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  // Check if current path should have a clean layout
  const shouldHaveCleanLayout = pathname === '/login' || pathname === '/admin/dashboard';

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full`}>
        {shouldHaveCleanLayout ? (
          // Clean layout without navigation elements
          <div className="min-h-screen bg-gray-50">
            {children}
          </div>
        ) : (
          // Regular layout with navigation for other pages
          <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar onMenuClick={() => setIsOpen(!isOpen)} />
            <div className="flex flex-1">
              <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} isMobile={isMobile} />
              <main className={`flex-1 transition-all duration-300 ${!isMobile && isOpen ? 'md:ml-64' : 'ml-0'} pt-16`}>
                {children}
              </main>
            </div>
            <Footer />
          </div>
        )}
      </body>
    </html>
  );
}