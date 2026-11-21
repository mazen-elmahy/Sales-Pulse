import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { AdminUser } from '../types/dashboard';

interface AuthContextType {
  user: AdminUser | null;
  token: string | null;
  isLoading: boolean;
  isDemo: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  loginAsDemo: () => void;
  logout: () => Promise<void>;
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://hspzkuwvnmpjyxppnbsu.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_aAWrvM71aKMQzlVHXl2BqQ_5VN5BqDU';

export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDemo, setIsDemo] = useState<boolean>(false);

  useEffect(() => {
    const savedDemo = localStorage.getItem('salespulse_demo_session');
    if (savedDemo === 'true') {
      setUser({
        id: 'demo-admin-id',
        email: 'admin@salespulse.co',
        role: 'admin',
        is_demo: true,
      });
      setToken('demo-token');
      setIsDemo(true);
      setIsLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const email = session.user.email || '';
        const role = session.user.app_metadata?.salespulse_role || 'admin';
        setUser({
          id: session.user.id,
          email,
          role: role as 'admin',
          is_demo: false,
        });
        setToken(session.access_token);
      }
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          role: 'admin',
          is_demo: false,
        });
        setToken(session.access_token);
        setIsDemo(false);
        localStorage.removeItem('salespulse_demo_session');
      } else if (!localStorage.getItem('salespulse_demo_session')) {
        setUser(null);
        setToken(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: pass,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.session) {
        setUser({
          id: data.user.id,
          email: data.user.email || email,
          role: 'admin',
          is_demo: false,
        });
        setToken(data.session.access_token);
        setIsDemo(false);
        localStorage.removeItem('salespulse_demo_session');
        return { success: true };
      }

      return { success: false, error: 'Failed to retrieve session token' };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed';
      return { success: false, error: msg };
    }
  };

  const loginAsDemo = () => {
    localStorage.setItem('salespulse_demo_session', 'true');
    setUser({
      id: 'demo-admin-id',
      email: 'admin@salespulse.co',
      role: 'admin',
      is_demo: true,
    });
    setToken('demo-token');
    setIsDemo(true);
  };

  const logout = async () => {
    localStorage.removeItem('salespulse_demo_session');
    await supabase.auth.signOut().catch(() => null);
    setUser(null);
    setToken(null);
    setIsDemo(false);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, isDemo, login, loginAsDemo, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
