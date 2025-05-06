'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/admin/layout/sidebar';
import { Header } from '@/components/admin/layout/header';
import { Toaster } from '@/components/ui/sonner';
import QueryProvider from '@/providers/query-provider';
import { AuthProvider } from '@/context/auth-context';
import { supabase } from '@/api/supabase/client';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsClient(true);
    
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.push('/login');
      } else {
        setIsAuthenticated(true);
      }
      setLoading(false);
    };
    
    checkAuth();
  }, [router]);

  if (!isClient) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <QueryProvider>
      <AuthProvider>
        <div className="flex min-h-screen flex-col">
          <Header onMenuClick={() => setSidebarOpen(true)} />
          <div className="flex flex-1">
            <div
              className={`fixed inset-y-0 z-50 flex w-64 flex-col transform transition-transform duration-300 md:translate-x-0 md:shadow-none ${
                sidebarOpen ? 'translate-x-0 shadow-lg' : '-translate-x-full'
              }`}
            >
              <Sidebar />
            </div>
            <div
              className={`fixed inset-0 z-40 bg-background/80 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
                sidebarOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
              }`}
              onClick={() => setSidebarOpen(false)}
            />
            <main className="flex-1 md:pl-64">
              <div className="container mx-auto p-6">
                {children}
              </div>
            </main>
          </div>
          <Toaster position="top-right" />
        </div>
      </AuthProvider>
    </QueryProvider>
  );
}
