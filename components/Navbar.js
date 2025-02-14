'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bell, LogIn } from 'lucide-react';
import { useAuth } from './client/AuthContext';
import { LoginDialog, ProfileDialog } from './client/AuthComponents';
import NewsTicker from './NewsTicker';
import NotificationContainer from './client/NotificationContainer';
import { useSidebar } from './SidebarContext';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const { user } = useAuth();
  const { toggleSidebar } = useSidebar();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuOpen && !event.target.closest('.mobile-menu-container')) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileMenuOpen]);

  return (
    <>
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg' : 'bg-gradient-to-r from-purple-600 to-indigo-600'
      }`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            {/* Left section with new structure */}
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleSidebar}
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

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-white hover:text-purple-200 text-sm font-medium transition-colors">
                Home
              </Link>
              <Link href="/mobile" className="text-white hover:text-purple-200 text-sm font-medium transition-colors">
                Mobiles info
              </Link>
              <Link href="/news" className="text-white hover:text-purple-200 text-sm font-medium transition-colors">
                News
              </Link>
              <Link href="/article" className="text-white hover:text-purple-200 text-sm font-medium transition-colors">
                Article
              </Link>
              <Link href="/gadget" className="text-white hover:text-purple-200 text-sm font-medium transition-colors">
                Gadget
              </Link>
              <Link href="/compare" className="text-white hover:text-purple-200 text-sm font-medium transition-colors">
                Compare
              </Link>
              <Link href="/about" className="text-white hover:text-purple-200 text-sm font-medium transition-colors">
                About
              </Link>
              <Link href="/contact" className="text-white hover:text-purple-200 text-sm font-medium transition-colors">
                Contact
              </Link>
            </div>

            {/* Right section */}
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <NotificationContainer isAdmin={user?.isAdmin} />
                  <button
                    onClick={() => setProfileDialogOpen(true)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/20 transition-colors"
                  >
                    <img
                      src={user.avatar || '/default-avatar.png'}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="text-white text-sm font-medium hidden md:block">
                      {user.name}
                    </span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setLoginDialogOpen(true)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white"
                >
                  <LogIn className="w-5 h-5" />
                  <span className="text-sm font-medium">Sign In</span>
                </button>
              )}

              {/* Mobile Menu Button */}
              <div className="md:hidden flex items-center">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 rounded-lg text-white hover:bg-white/20 transition-colors"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 mobile-menu-container">
              <div className="flex flex-col space-y-4">
                <Link href="/" 
                  className="text-white hover:text-purple-200 text-sm font-medium transition-colors"
                  onClick={() => setMobileMenuOpen(false)}>
                  Home
                </Link>
                <Link href="/mobile" 
                  className="text-white hover:text-purple-200 text-sm font-medium transition-colors"
                  onClick={() => setMobileMenuOpen(false)}>
                  Mobiles info
                </Link>
                <Link href="/news" 
                  className="text-white hover:text-purple-200 text-sm font-medium transition-colors"
                  onClick={() => setMobileMenuOpen(false)}>
                  News
                </Link>
                <Link href="/article" 
                  className="text-white hover:text-purple-200 text-sm font-medium transition-colors"
                  onClick={() => setMobileMenuOpen(false)}>
                  Article
                </Link>
                <Link href="/gadget" 
                  className="text-white hover:text-purple-200 text-sm font-medium transition-colors"
                  onClick={() => setMobileMenuOpen(false)}>
                  Gadget
                </Link>
                <Link href="/compare" 
                  className="text-white hover:text-purple-200 text-sm font-medium transition-colors"
                  onClick={() => setMobileMenuOpen(false)}>
                  Compare
                </Link>
                <Link href="/about" 
                  className="text-white hover:text-purple-200 text-sm font-medium transition-colors"
                  onClick={() => setMobileMenuOpen(false)}>
                  About
                </Link>
                <Link href="/contact" 
                  className="text-white hover:text-purple-200 text-sm font-medium transition-colors"
                  onClick={() => setMobileMenuOpen(false)}>
                  Contact
                </Link>
                {user && (
                  <Link href="/notifications"
                    className="text-white hover:text-purple-200 text-sm font-medium transition-colors"
                    onClick={() => setMobileMenuOpen(false)}>
                    Notifications
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Auth Dialogs */}
      <LoginDialog 
        isOpen={loginDialogOpen} 
        onClose={() => setLoginDialogOpen(false)} 
      />
      
      <ProfileDialog 
        isOpen={profileDialogOpen} 
        onClose={() => setProfileDialogOpen(false)} 
      />

      <NewsTicker />
    </>
  );
}