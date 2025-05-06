'use client';

import { ReactNode } from 'react';
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/auth-context";
import QueryProvider from "@/providers/query-provider";

/**
 * Client providers wrapper component that combines all context providers
 * This keeps the server components clean and allows metadata to work properly
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <AuthProvider>
        {children}
        <Toaster position="top-right" />
      </AuthProvider>
    </QueryProvider>
  );
}
