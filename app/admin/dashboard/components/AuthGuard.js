'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthGuard({ children }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const res = await fetch('/api/auth/verify', { credentials: 'include' });
        if (!res.ok) throw new Error('Unauthorized');
        setIsAuthenticated(true);
      } catch (error) {
        router.push('/login');
      }
    };
    verifyAuth();
  }, [router]);

  return isAuthenticated ? children : null;
}