import { useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'teacher' | 'student' | 'kitchen';
  avatar_url?: string;
  class?: string;
  subject?: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listener - keep synchronous and defer fetches
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      if (session?.user) {
        const userId = session.user.id;
        setTimeout(async () => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .maybeSingle();
          if (profile) {
            setUser({
              id: profile.id,
              email: profile.email,
              full_name: profile.full_name,
              role: profile.role,
              avatar_url: profile.avatar_url,
              class: profile.class,
              subject: profile.subject,
            });
          } else {
            setUser(null);
          }
          setLoading(false);
        }, 0);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    // Initial session check AFTER listener
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        const userId = session.user.id;
        supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle()
          .then(({ data: profile }) => {
            if (profile) {
              setUser({
                id: profile.id,
                email: profile.email,
                full_name: profile.full_name,
                role: profile.role,
                avatar_url: profile.avatar_url,
                class: profile.class,
                subject: profile.subject,
              });
            }
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, userData: { full_name: string; role: string }) => {
    const redirectUrl = `${window.location.origin}/`;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: userData,
      },
    });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setUser(null);
      setSession(null);
    }
    return { error };
  };

  return {
    user: user as User,
    session: session as Session,
    loading,
    isAuthenticated: !!session,
    signUp,
    signIn,
    signOut,
  };
};
