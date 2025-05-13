'use client';

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useAuth } from '@/api/hooks/useAuth';
import { User, Session } from '@supabase/supabase-js';

// Define flexible types that match Supabase actual return types
type AuthResponseData = {
  // Properties that can be included in data responses
  [key: string]: unknown;
  user?: User | null;
  session?: Session | null;
  url?: string;
  messageId?: string | null;
};

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ data?: AuthResponseData; error?: unknown }>;
  signInWithGoogle: () => Promise<{ data?: AuthResponseData; error?: unknown }>;
  signInWithFacebook: () => Promise<{ data?: AuthResponseData; error?: unknown }>;
  signInWithPhone: (phone: string) => Promise<{ data?: AuthResponseData; error?: unknown }>;
  verifyOtp: (phone: string, token: string) => Promise<{ data?: AuthResponseData; error?: unknown }>;
  signUp: (email: string, password: string) => Promise<{ data?: AuthResponseData; error?: unknown }>;
  signOut: () => Promise<{ success?: boolean; error?: unknown }>;
  resetPassword: (email: string) => Promise<{ success?: boolean; error?: unknown }>;
  updatePassword: (password: string) => Promise<{ success?: boolean; error?: unknown }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Always call the hook (React hooks can't be called conditionally)
  const auth = useAuth();
  
  // Use error boundary pattern with useState
  const [hasError, setHasError] = useState(false);
  
  // Add error handling for auth operations
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('Auth provider error:', event.error);
      setHasError(true);
    };
    
    // Set up global error handler
    window.addEventListener('error', handleError);
    
    return () => {
      window.removeEventListener('error', handleError);
    };
  }, []);
  
  // If there's an error in the auth system, provide a fallback that won't break the app
  if (hasError) {
    console.warn('Using fallback auth due to errors');
    return (
      <AuthContext.Provider value={{
        user: null,
        session: null,
        loading: false,
        signIn: async () => ({ error: 'Auth system unavailable' }),
        signInWithGoogle: async () => ({ error: 'Auth system unavailable' }),
        signInWithFacebook: async () => ({ error: 'Auth system unavailable' }),
        signInWithPhone: async () => ({ error: 'Auth system unavailable' }),
        verifyOtp: async () => ({ error: 'Auth system unavailable' }),
        signUp: async () => ({ error: 'Auth system unavailable' }),
        signOut: async () => ({ error: 'Auth system unavailable' }),
        resetPassword: async () => ({ error: 'Auth system unavailable' }),
        updatePassword: async () => ({ error: 'Auth system unavailable' }),
      }}>
        {children}
      </AuthContext.Provider>
    );
  }

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  
  return context;
};
