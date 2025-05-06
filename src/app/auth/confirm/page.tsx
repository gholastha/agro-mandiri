'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/api/supabase/client';

export default function AuthConfirmPage() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error checking auth session:', error);
          router.push('/login');
          return;
        }
        
        if (!data.session) {
          // No session found, redirect to login
          router.push('/login');
        } else {
          // Session found, redirect to admin dashboard
          setTimeout(() => {
            router.push('/admin');
          }, 1000); // Small delay for visual confirmation
        }
      } catch (err) {
        console.error('Unexpected error during auth check:', err);
        router.push('/login');
      } finally {
        setIsChecking(false);
      }
    };
    
    checkAuth();
  }, [router]);
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="text-center">
        {isChecking ? (
          <div className="flex flex-col items-center space-y-4">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            <p className="text-sm text-muted-foreground">Memeriksa autentikasi...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-4">
            <p className="text-sm text-muted-foreground">Mengalihkan ke Dashboard Admin...</p>
          </div>
        )}
      </div>
    </div>
  );
}
