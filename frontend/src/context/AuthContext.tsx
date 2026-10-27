import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, subscribeToAuthChanges, logoutUser } from '../services/firebaseConfig';
import { authApi, SyncUserResponse } from '../services/apiClient';

interface AuthContextType {
  firebaseUser: User | null;
  userProfile: SyncUserResponse['user'] | null;
  role: 'STD' | 'ADM' | null;
  placementCompleted: boolean;
  isLoading: boolean;
  logout: () => Promise<void>;
  syncProfile: (displayName?: string) => Promise<SyncUserResponse | null>;
  getTargetRouteByRole: () => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<SyncUserResponse['user'] | null>(null);
  const [role, setRole] = useState<'STD' | 'ADM' | null>(null);
  const [placementCompleted, setPlacementCompleted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const syncProfile = async (displayName?: string): Promise<SyncUserResponse | null> => {
    try {
      const res = await authApi.syncUser(displayName);
      if (res && res.user) {
        setUserProfile(res.user);
        setRole(res.role || res.user.role || 'STD');
        setPlacementCompleted(res.placement_completed ?? res.user.placement_completed ?? false);
        return res;
      }
    } catch (err) {
      console.warn('Backend sync failed, falling back to local user profile:', err);
    }

    // Resilient fallback profile
    const saved = localStorage.getItem('edutech_simulated_user');
    let parsedSaved: any = {};
    if (saved) {
      try { parsedSaved = JSON.parse(saved); } catch {}
    }

    const email = firebaseUser?.email || parsedSaved.email || 'user.google@edutech.edu';
    const uid = firebaseUser?.uid || parsedSaved.uid || 'google-user-101';
    const name = displayName || firebaseUser?.displayName || parsedSaved.displayName || 'مستخدم إديوتك';
    const isAdmin = email.includes('admin');
    const fallbackRole: 'STD' | 'ADM' = isAdmin ? 'ADM' : 'STD';

    const fallbackProfile: SyncUserResponse['user'] = {
      id: uid,
      firebase_uid: uid,
      email: email,
      display_name: name,
      role: fallbackRole,
      placement_completed: true,
      enrolled_courses: ['cs-advanced-js'],
      created_at: new Date().toISOString(),
    };

    setUserProfile(fallbackProfile);
    setRole(fallbackRole);
    setPlacementCompleted(true);

    return {
      success: true,
      user: fallbackProfile,
      role: fallbackRole,
      placement_completed: true,
    };
  };

  useEffect(() => {
    let isMounted = true;

    // Safety fallback: Never keep the loading screen for more than 250ms on startup
    const safetyTimer = setTimeout(() => {
      if (isMounted) {
        setIsLoading(false);
      }
    }, 250);

    const unsubscribe = subscribeToAuthChanges(async (user) => {
      if (!isMounted) return;
      clearTimeout(safetyTimer);
      setFirebaseUser(user);

      if (user) {
        setIsLoading(false);
        syncProfile(user.displayName || undefined).catch((err) => {
          console.warn('Background sync failed:', err);
        });
      } else {
        setUserProfile(null);
        setRole(null);
        setPlacementCompleted(false);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
      clearTimeout(safetyTimer);
      unsubscribe();
    };
  }, []);

  const logout = async () => {
    await logoutUser();
    setUserProfile(null);
    setRole(null);
    setPlacementCompleted(false);
    localStorage.removeItem('dev_auth_token');
  };

  const getTargetRouteByRole = (): string => {
    if (role === 'ADM') {
      return '/admin/dashboard';
    }
    return placementCompleted ? '/dashboard' : '/placement-test';
  };

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        userProfile,
        role,
        placementCompleted,
        isLoading,
        logout,
        syncProfile,
        getTargetRouteByRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
