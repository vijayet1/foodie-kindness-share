
import { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type UserType = 'individual' | 'orgs' | 'charity_orgs';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  userType: UserType | null;
  isLoading: boolean;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  userType: null,
  isLoading: true,
  refreshProfile: async () => {},
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userType, setUserType] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Function to get user profile data from the profiles table
  const getUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error("Error fetching user profile:", error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error("Error in getUserProfile:", error);
      return null;
    }
  };

  // Function to create profile if doesn't exist
  const createProfileIfNeeded = async (currentUser: User) => {
    try {
      // Check if profile exists
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', currentUser.id)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error("Error checking profile:", error);
        return;
      }
      
      // If profile doesn't exist, create it
      if (!data) {
        const userTypeFromMeta = currentUser.user_metadata.user_type as UserType;
        
        await supabase.from('profiles').insert({
          id: currentUser.id,
          email: currentUser.email,
          name: currentUser.user_metadata.name,
          user_type: userTypeFromMeta || 'individual',
          avatar_url: currentUser.user_metadata.avatar_url
        });
      }
    } catch (error) {
      console.error("Error creating profile:", error);
    }
  };

  // Function to refresh user profile
  const refreshProfile = async () => {
    if (!user) return;
    
    const profile = await getUserProfile(user.id);
    if (profile) {
      setUserType(profile.user_type as UserType);
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      // Clear session state after successful sign out
      setSession(null);
      setUser(null);
      setUserType(null);
      
      return Promise.resolve();
    } catch (error) {
      console.error("Sign out error:", error);
      return Promise.reject(error);
    }
  };

  useEffect(() => {
    console.log("Setting up auth state in AuthContext");
    setIsLoading(true);
    
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth state change:", event, currentSession ? "Session exists" : "No session");
        
        if (currentSession) {
          setSession(currentSession);
          setUser(currentSession.user);
          
          // Create profile if needed
          await createProfileIfNeeded(currentSession.user);
          
          // Get user type from profiles table
          const profile = await getUserProfile(currentSession.user.id);
          
          if (profile) {
            setUserType(profile.user_type as UserType);
          } else {
            // Fallback to metadata
            setUserType(currentSession.user.user_metadata.user_type as UserType);
          }
        } else {
          setSession(null);
          setUser(null);
          setUserType(null);
        }
        
        // Set loading to false after handling the auth state
        setIsLoading(false);
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(async ({ data: { session: currentSession } }) => {
      console.log("Got session:", currentSession ? "Session exists" : "No session");
      
      if (currentSession) {
        setSession(currentSession);
        setUser(currentSession.user);
        
        // Create profile if needed
        await createProfileIfNeeded(currentSession.user);
        
        // Get user type from profiles table
        const profile = await getUserProfile(currentSession.user.id);
        
        if (profile) {
          setUserType(profile.user_type as UserType);
        } else {
          // Fallback to metadata
          setUserType(currentSession.user.user_metadata.user_type as UserType);
        }
      }
      
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ session, user, userType, isLoading, refreshProfile, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
