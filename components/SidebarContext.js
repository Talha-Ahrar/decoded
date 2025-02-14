'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

const SidebarContext = createContext();

export function SidebarProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [sidebarType, setSidebarType] = useState('mobile');
  const pathname = usePathname();

  // Update sidebar type based on pathname
  useEffect(() => {
    if (pathname === '/' || pathname.startsWith('/mobile')) {
      setSidebarType('mobile');
    } else if (pathname.startsWith('/gadget')) {
      setSidebarType('gadget');
    } else if (pathname.startsWith('/news')) {
      setSidebarType('news');
    } else if (pathname.startsWith('/article')) {
      setSidebarType('article');
    }
  }, [pathname]);

  // Load saved state on mount
  useEffect(() => {
    const savedIsOpen = localStorage.getItem('sidebarOpen');
    if (savedIsOpen !== null) {
      setIsOpen(JSON.parse(savedIsOpen));
    }
  }, []);

  // Save state changes to localStorage
  useEffect(() => {
    localStorage.setItem('sidebarOpen', JSON.stringify(isOpen));
  }, [isOpen]);

  const toggleSidebar = () => {
    setIsOpen(prev => !prev);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  const openSidebar = () => {
    setIsOpen(true);
  };

  return (
    <SidebarContext.Provider value={{
      isOpen,
      sidebarType,
      toggleSidebar,
      closeSidebar,
      openSidebar,
      setSidebarType
    }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}