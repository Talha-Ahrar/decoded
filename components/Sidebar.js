'use client';

import Link from 'next/link';

export default function Sidebar({ isOpen, setIsOpen, isMobile }) {
  const mobileItems = [
    "Samsung", "Apple", "Xiaomi", "Oppo", "Vivo", "OnePlus", "Realme", "Nokia",
    "Motorola", "Sony", "LG", "Huawei", "Google", "Asus", "BlackBerry", "HTC",
    "Lenovo", "ZTE", "Alcatel", "Honor"
  ];

  return (
    <aside
      className={`fixed top-[96px] h-[calc(100vh-96px)] bg-gradient-to-b from-indigo-600 to-purple-600
        ${isMobile ? 'w-56 transform transition-transform duration-300 ease-in-out z-30' : 'w-56'}
        ${isOpen ? 'translate-x-0' : isMobile ? '-translate-x-full' : '-translate-x-56'}
      `}
    >
      <div className="h-full flex flex-col">
        <div className="p-3 border-b border-white/20">
          <h2 className="text-sm font-medium text-white">Mobile Brands</h2>
        </div>

        <nav className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="py-1">
            {mobileItems.map((brand, index) => (
              <Link
                key={index}
                href={`/brand/${brand.toLowerCase()}`}
                className="flex items-center px-3 py-1.5 text-sm text-white hover:bg-white/20 transition-colors"
              >
                <span className="text-sm">{brand}</span>
              </Link>
            ))}
          </div>
        </nav>

        <div className="p-3 border-t border-white/20">
          <div className="flex items-center space-x-2">
            <div className="text-xs text-white/80">
              <p>Total Brands: {mobileItems.length}</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}