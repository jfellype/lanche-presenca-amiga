import { useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'teacher' | 'student' | 'kitchen' | 'library';
  avatar_url?: string;
  class?: string;
  subject?: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!isMounted) return;
      setSession(session);
      
      if (session?.user) {
        const userId = session.user.id;
        setTimeout(async () => {
          if (!isMounted) return;
          
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .maybeSingle();

          let resolvedRole: any = 'student';
          try {
            const { data: roles } = await supabase
              .from('user_roles')
              .select('role')
              .eq('user_id', userId);
            resolvedRole = roles?.[0]?.role ?? profile?.role ?? 'student';
          } catch (e) {
            resolvedRole = profile?.role ?? 'student';
          }

          if (profile && isMounted) {
            setUser({
              id: profile.id,
              email: profile.email,
              full_name: profile.full_name,
              role: resolvedRole,
              avatar_url: profile.avatar_url,
              class: profile.class,
              subject: profile.subject,
            });
            setLoading(false);
          } else if (isMounted) {
            // Perfil não encontrado: aguardar trigger popular os dados
            console.warn('Perfil não encontrado, aguardando criação...');
            setLoading(false);
          }
        }, 100);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!isMounted) return;
      setSession(session);
      
      if (session?.user) {
        const userId = session.user.id;
        (async () => {
          if (!isMounted) return;
          
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .maybeSingle();

          let resolvedRole: any = 'student';
          try {
            const { data: roles } = await supabase
              .from('user_roles')
              .select('role')
              .eq('user_id', userId);
            resolvedRole = roles?.[0]?.role ?? profile?.role ?? 'student';
          } catch (e) {
            resolvedRole = profile?.role ?? 'student';
          }

          if (profile && isMounted) {
            setUser({
              id: profile.id,
              email: profile.email,
              full_name: profile.full_name,
              role: resolvedRole,
              avatar_url: profile.avatar_url,
              class: profile.class,
              subject: profile.subject,
            });
          }
          if (isMounted) setLoading(false);
        })();
      } else if (isMounted) {
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
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
