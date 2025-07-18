import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  adminRole: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  checkAdminStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminRole, setAdminRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAdminStatus = async () => {
    if (!user) {
      setIsAdmin(false);
      setAdminRole(null);
      return;
    }

    try {
      console.log('Checking admin status for user:', user.id);
      
      // First check if the table exists and user has access
      const { data, error } = await supabase
        .from('admin_users')
        .select('role')
        .eq('user_id', user.id)
        .maybeSingle(); // Use maybeSingle instead of single to handle no results gracefully

      console.log('Admin query result:', { data, error });

      if (error) {
        console.error('Error checking admin status:', error);
        
        // If it's a permissions or table error, try alternative approach
        if (error.code === '42501' || error.code === '42P01') {
          console.log('Trying alternative admin check...');
          // Fallback: check using RPC function if available
          const { data: isAdminResult, error: rpcError } = await supabase
            .rpc('is_admin', { user_uuid: user.id });
          
          if (!rpcError && isAdminResult) {
            setIsAdmin(true);
            setAdminRole('admin');
            return;
          }
        }
        
        // If all methods fail, user is not admin
        setIsAdmin(false);
        setAdminRole(null);
      } else if (data) {
        console.log('User is admin with role:', data.role);
        setIsAdmin(true);
        setAdminRole(data.role);
      } else {
        console.log('No admin record found for user');
        setIsAdmin(false);
        setAdminRole(null);
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
      setAdminRole(null);
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Check admin status when user changes
  useEffect(() => {
    if (user) {
      checkAdminStatus();
    } else {
      setIsAdmin(false);
      setAdminRole(null);
    }
  }, [user]);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
    setAdminRole(null);
  };

  const value = {
    user,
    session,
    isAdmin,
    adminRole,
    loading,
    signIn,
    signOut,
    checkAdminStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};