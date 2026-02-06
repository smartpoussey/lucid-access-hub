import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User, UserRole, AdminRegistrationData, StaffRegistrationData, ClientRegistrationData } from '@/types';
import { 
  loginWithEmail,
  signOutUser,
  getStoredUser,
  storeUser,
  clearStoredUser,
  subscribeToAuthState,
  registerWithRole,
} from '@/services/auth.service';
import { getUserById } from '@/services/firestore.service';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  registerWithEmail: (
    email: string, 
    password: string, 
    role: UserRole, 
    profileData: AdminRegistrationData | StaffRegistrationData | ClientRegistrationData
  ) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = getStoredUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setIsLoading(false);

    // Subscribe to auth state changes
    const unsubscribe = subscribeToAuthState(async (firebaseUser) => {
      if (firebaseUser && firebaseUser.emailVerified) {
        // Fetch user data from Firestore
        const userData = await getUserById(firebaseUser.uid);
        if (userData) {
          storeUser(userData);
          setUser(userData);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const firebaseUser = await loginWithEmail(email, password);
      const userData = await getUserById(firebaseUser.uid);
      
      if (!userData) {
        await signOutUser();
        return { success: false, error: 'User profile not found.' };
      }

      storeUser(userData);
      setUser(userData);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await signOutUser();
    clearStoredUser();
    setUser(null);
  }, []);

  const registerWithEmailHandler = useCallback(async (
    email: string,
    password: string,
    role: UserRole,
    profileData: AdminRegistrationData | StaffRegistrationData | ClientRegistrationData
  ): Promise<{ success: boolean; error?: string }> => {
    return await registerWithRole(email, password, role, profileData);
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    registerWithEmail: registerWithEmailHandler,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
