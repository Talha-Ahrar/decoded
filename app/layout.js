'use client';

import './globals.css';
import { Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import { useState, useEffect, Suspense } from 'react';
import { usePathname } from 'next/navigation';
import { AuthProvider } from '../components/client/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { SidebarProvider, useSidebar } from '@/components/SidebarContext';

const inter = Inter({ subsets: ['latin'] });

function MainLayout({ children }) {
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const { isOpen } = useSidebar();

  const shouldHaveCleanLayout = pathname === '/login' || pathname === '/admin/dashboard' || pathname === '/userlogin' || pathname === '/userdashboard';

  useEffect(() => {
    let timeoutId;
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkMobile, 100);
    };

    checkMobile();
    window.addEventListener('resize', debouncedResize);
    return () => {
      window.removeEventListener('resize', debouncedResize);
      clearTimeout(timeoutId);
    };
  }, []);

  if (shouldHaveCleanLayout) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Suspense fallback={<div className="h-1 bg-blue-600 animate-loading-bar" />}>
          {children}
        </Suspense>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar isMobile={isMobile} />
        <main className={`flex-1 transition-all duration-300 pt-16 ${isOpen ? 'md:ml-56' : ''}`}>
          <Suspense fallback={<div className="h-1 bg-blue-600 animate-loading-bar" />}>
            {children}
          </Suspense>
        </main>
      </div>
      <footer className={`${isOpen ? 'md:ml-56' : ''} transition-all duration-300`}>
        <Footer />
      </footer>
    </div>
  );
}

function Providers({ children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <SidebarProvider>
          {children}
        </SidebarProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const shouldHaveCleanLayout = pathname === '/login' || pathname === '/admin/dashboard' || pathname === '/userlogin' || pathname === '/userdashboard';

  if (shouldHaveCleanLayout) {
    return (
      <html lang="en" className="h-full">
        <body className={`${inter.className} h-full`}>
          <Providers>
            <div className="min-h-screen bg-gray-50">
              {children}
            </div>
          </Providers>
        </body>
      </html>
    );
  }

  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full`}>
        <Providers>
          <MainLayout>{children}</MainLayout>
        </Providers>
      </body>
    </html>
  );
}