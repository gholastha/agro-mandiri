'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../supabase/client';
import { User, Session, Provider } from '@supabase/supabase-js';
import { toast } from 'sonner';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        setSession(data.session);
        setUser(data.session?.user ?? null);
      } catch (error) {
        console.error('Error getting session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        return { error };
      }

      return { data };
    } catch (error) {
      console.error('Unexpected error during sign in:', error);
      toast.error('Terjadi kesalahan saat login. Silakan coba lagi.');
      return { error };
    }
  };

  const signInWithOAuth = async (provider: Provider) => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/confirm`,
        },
      });

      if (error) {
        toast.error(error.message);
        return { error };
      }

      return { data };
    } catch (error) {
      console.error(`Unexpected error during ${provider} sign in:`, error);
      toast.error(`Terjadi kesalahan saat login dengan ${provider}. Silakan coba lagi.`);
      return { error };
    }
  };

  const signInWithGoogle = async () => {
    return signInWithOAuth('google');
  };

  const signInWithFacebook = async () => {
    return signInWithOAuth('facebook');
  };

  const signInWithPhone = async (phone: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        phone,
        options: {
          shouldCreateUser: true,
        },
      });

      if (error) {
        toast.error(error.message);
        return { error };
      }

      toast.success('Kode OTP telah dikirim ke nomor telepon Anda');
      return { data };
    } catch (error) {
      console.error('Unexpected error during phone sign in:', error);
      toast.error('Terjadi kesalahan saat mengirim OTP. Silakan coba lagi.');
      return { error };
    }
  };

  const verifyOtp = async (phone: string, token: string) => {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone,
        token,
        type: 'sms',
      });

      if (error) {
        toast.error(error.message);
        return { error };
      }

      return { data };
    } catch (error) {
      console.error('Unexpected error during OTP verification:', error);
      toast.error('Terjadi kesalahan saat verifikasi OTP. Silakan coba lagi.');
      return { error };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        return { error };
      }

      return { data };
    } catch (error) {
      console.error('Unexpected error during sign up:', error);
      toast.error('Terjadi kesalahan saat mendaftar. Silakan coba lagi.');
      return { error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast.error(error.message);
        return { error };
      }
      
      return { success: true };
    } catch (error) {
      console.error('Unexpected error during sign out:', error);
      toast.error('Terjadi kesalahan saat logout. Silakan coba lagi.');
      return { error };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        toast.error(error.message);
        return { error };
      }

      toast.success('Email reset password telah dikirim');
      return { success: true };
    } catch (error) {
      console.error('Unexpected error during password reset:', error);
      toast.error('Terjadi kesalahan. Silakan coba lagi.');
      return { error };
    }
  };

  const updatePassword = async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        toast.error(error.message);
        return { error };
      }

      toast.success('Password berhasil diperbarui');
      return { success: true };
    } catch (error) {
      console.error('Unexpected error during password update:', error);
      toast.error('Terjadi kesalahan. Silakan coba lagi.');
      return { error };
    }
  };

  return {
    user,
    session,
    loading,
    signIn,
    signInWithGoogle,
    signInWithFacebook,
    signInWithPhone,
    verifyOtp,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
  };
};
