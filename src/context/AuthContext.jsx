import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Timeout wrapper to prevent hanging promises
  const withTimeout = (promise, timeoutMs = 15000, operationName = 'Operation') => {
    return Promise.race([
      promise,
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error(`${operationName} timed out. Check connection.`)), timeoutMs)
      ),
    ]);
  };

  const fetchProfile = async (userId) => {
    if (!userId) return null;
    try {
      console.log(`[AuthContext] Fetching profile for user: ${userId}`);
      const { data, error } = await withTimeout(
        supabase.from('profiles').select('*').eq('id', userId).single(),
        10000,
        'Profile fetch'
      );
      if (error) {
        console.error('[AuthContext] Profile fetch error:', error);
        return null;
      }
      console.log('[AuthContext] Profile loaded successfully:', data);
      return data;
    } catch (err) {
      console.error('[AuthContext] Unexpected profile fetch error:', err);
      return null;
    }
  };

  // 1. Initial Session Check & Listeners
  useEffect(() => {
    let mounted = true;

    async function initializeSession() {
      try {
        console.log('[AuthContext] Initializing session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          console.log('[AuthContext] Initial session retrieved. Has user:', !!session?.user);
        }
      } catch (err) {
        console.error('[AuthContext] Session initialization error:', err);
      } finally {
        if (mounted) {
          setIsInitialized(true);
        }
      }
    }

    initializeSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, currentSession) => {
      if (event === 'INITIAL_SESSION') return;
      if (!mounted) return;

      console.log('[AuthContext] Auth event fired:', event);
      setSession(currentSession);
      
      // If the user identity changed, update it.
      // We don't automatically set loading=false here. The profile effect handles that.
      if (currentSession?.user?.id !== user?.id) {
        setUser(currentSession?.user ?? null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [user?.id]); 

  // 2. Profile Fetching Logic (Reactive to User changes)
  useEffect(() => {
    let mounted = true;

    async function loadProfileData() {
      if (!isInitialized) return;

      if (!user) {
        if (mounted) {
          setProfile(null);
          setLoading(false); // Safe to release loading, user is confirmed absent
          console.log('[AuthContext] No user found. Loading complete.');
        }
        return;
      }

      try {
        setLoading(true); // Lock the app state while fetching
        const profileData = await fetchProfile(user.id);
        if (mounted) {
          setProfile(profileData);
        }
      } finally {
        if (mounted) {
          setLoading(false); // Release the app state
          console.log('[AuthContext] Profile hydration complete. Loading released.');
        }
      }
    }

    loadProfileData();

    return () => {
      mounted = false;
    };
  }, [user?.id, isInitialized]);

  const signUp = async (email, password, fullName) => {
    try {
      setLoading(true);
      console.log('Attempting sign up for:', email);
      const { data, error } = await withTimeout(
        supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } },
        }),
        15000,
        'Sign up'
      );
      if (error) {
        setLoading(false);
        console.error('Supabase signUp error:', error);
      } else {
        if (data?.session?.user) {
          setUser(data.session.user);
        } else {
          setLoading(false);
        }
        console.log('Sign up successful:', data);
      }
      return { data, error };
    } catch (err) {
      setLoading(false);
      console.error('Unexpected signUp error:', err);
      return { data: null, error: err };
    }
  };

  const signIn = async (email, password) => {
    try {
      setLoading(true); // Lock state pre-emptively so navigation doesn't fail
      console.log('Attempting sign in for:', email);
      const { data, error } = await withTimeout(
        supabase.auth.signInWithPassword({ email, password }),
        15000,
        'Sign in'
      );
      if (error) {
        setLoading(false); // Release on error
        console.error('Supabase signIn error:', error);
      } else {
        // Pre-emptively update user to trigger the profile effect
        if (data?.session?.user) {
          setUser(data.session.user);
        } else {
          setLoading(false);
        }
        console.log('Sign in successful:', data);
      }
      return { data, error };
    } catch (err) {
      setLoading(false);
      console.error('Unexpected signIn error:', err);
      return { data: null, error: err };
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await withTimeout(supabase.auth.signOut(), 10000, 'Sign out');
      if (error) console.error('Supabase signOut error:', error);
      
      // Manually clear state to ensure immediate UI update
      setUser(null);
      setProfile(null);
      setSession(null);
      
      return { error };
    } catch (err) {
      setLoading(false);
      console.error('Unexpected signOut error:', err);
      return { error: err };
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, session, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};