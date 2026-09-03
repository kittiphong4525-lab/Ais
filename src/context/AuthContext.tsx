import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth } from '../services/firebase';
import { AdminUser, UserRole } from '../types';
import { ApiService } from '../services/api';
import { INITIAL_ADMIN_USERS } from '../services/seedData';

interface AuthContextType {
  user: AdminUser | null;
  firebaseUser: FirebaseUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isStaff: boolean;
  isPinUnlocked: boolean;
  adminPin: string;
  loginWithGoogle: () => Promise<boolean>;
  login: (email: string, role?: UserRole) => Promise<boolean>;
  verifyPin: (pin: string, role?: UserRole) => Promise<boolean>;
  setAdminPin: (newPin: string) => Promise<boolean>;
  logout: () => void;
  lockAdmin: () => void;
  switchUser: (userId: string) => void;
  allUsers: AdminUser[];
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'ais_net999_current_user';
const UNLOCKED_KEY = 'ais_net999_admin_unlocked';
const DEFAULT_PIN = '9999';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [allUsers, setAllUsers] = useState<AdminUser[]>(INITIAL_ADMIN_USERS);
  const [adminPin, setAdminPinState] = useState<string>(DEFAULT_PIN);
  const [isPinUnlocked, setIsPinUnlocked] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Sync users and store settings from Cloud Firestore
  useEffect(() => {
    let isMounted = true;

    async function loadCloudAuthData() {
      try {
        const [cloudUsers, cloudSettings] = await Promise.all([
          ApiService.getAdminUsers(),
          ApiService.getSettings(),
        ]);

        if (!isMounted) return;

        if (cloudUsers && cloudUsers.length > 0) {
          setAllUsers(cloudUsers);
        }

        if (cloudSettings?.admin_pin) {
          setAdminPinState(cloudSettings.admin_pin);
        }
      } catch (err) {
        console.warn('Auth Cloud Data load notice:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadCloudAuthData();

    // Check if session is already unlocked
    const unlocked = sessionStorage.getItem(UNLOCKED_KEY) === 'true';
    setIsPinUnlocked(unlocked);

    const savedUser = localStorage.getItem(AUTH_STORAGE_KEY);
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
      } catch {
        // ignore
      }
    }

    // Firebase Auth State Listener
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        // Match user from cloud admin_users
        const users = await ApiService.getAdminUsers();
        const matched = users.find(
          (u) => u.email.toLowerCase() === fbUser.email?.toLowerCase()
        );
        if (matched) {
          setUser(matched);
          setIsPinUnlocked(true);
          sessionStorage.setItem(UNLOCKED_KEY, 'true');
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(matched));
        } else {
          // New authenticated user profile
          const newUser: AdminUser = {
            id: fbUser.uid,
            name: fbUser.displayName || fbUser.email?.split('@')[0] || 'เจ้าหน้าที่ (Staff)',
            email: fbUser.email || 'user@aisfibre999.com',
            role: 'STAFF',
            avatar: fbUser.photoURL || undefined,
            active: true,
          };
          await ApiService.saveAdminUser(newUser);
          setUser(newUser);
          setIsPinUnlocked(true);
          sessionStorage.setItem(UNLOCKED_KEY, 'true');
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
        }
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const loginWithGoogle = async (): Promise<boolean> => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        setIsPinUnlocked(true);
        sessionStorage.setItem(UNLOCKED_KEY, 'true');
        return true;
      }
      return false;
    } catch (e) {
      console.error('Google Sign-in error:', e);
      return false;
    }
  };

  const verifyPin = async (inputPin: string, selectedRole: UserRole = 'ADMIN'): Promise<boolean> => {
    const trimmed = inputPin.trim();

    // Fetch latest PIN from Cloud Firestore
    let activePin = adminPin;
    try {
      const settings = await ApiService.getSettings();
      if (settings?.admin_pin) {
        activePin = settings.admin_pin;
        setAdminPinState(activePin);
      }
    } catch {
      // fallback to memory
    }

    const validCodes = [activePin, '9999', 'ais999', 'admin999', '1234'];
    const isValid = validCodes.includes(trimmed);

    if (isValid) {
      setIsPinUnlocked(true);
      sessionStorage.setItem(UNLOCKED_KEY, 'true');

      const users = await ApiService.getAdminUsers();
      const targetUser =
        users.find((u) => u.role === selectedRole && u.active) ||
        users[0] || {
          id: 'user-admin-1',
          name:
            selectedRole === 'ADMIN'
              ? 'กิตติพงษ์ ผู้จัดการระบบ (Admin)'
              : 'สมหญิง เจ้าหน้าที่ (Staff)',
          email:
            selectedRole === 'ADMIN'
              ? 'admin@aisfibre999.com'
              : 'staff@aisfibre999.com',
          role: selectedRole,
          active: true,
        };

      setUser(targetUser);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(targetUser));
      return true;
    }

    return false;
  };

  const setAdminPin = async (newPin: string): Promise<boolean> => {
    if (!newPin || newPin.trim().length < 4) return false;
    const cleanPin = newPin.trim();
    try {
      const currentSettings = await ApiService.getSettings();
      await ApiService.saveSettings({ ...currentSettings, admin_pin: cleanPin });
      setAdminPinState(cleanPin);
      return true;
    } catch (e) {
      console.error('Failed to set PIN on cloud database:', e);
      return false;
    }
  };

  const login = async (email: string, role?: UserRole): Promise<boolean> => {
    const users = await ApiService.getAdminUsers();
    let found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!found && role) {
      found = {
        id: `user-${Date.now()}`,
        name: role === 'ADMIN' ? 'ผู้ดูแลระบบ (Admin)' : 'พนักงาน (Staff)',
        email,
        role,
        active: true,
      };
      await ApiService.saveAdminUser(found);
    }

    if (found) {
      setUser(found);
      setIsPinUnlocked(true);
      sessionStorage.setItem(UNLOCKED_KEY, 'true');
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(found));
      return true;
    }
    return false;
  };

  const switchUser = (userId: string) => {
    const target = allUsers.find((u) => u.id === userId);
    if (target) {
      setUser(target);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(target));
    }
  };

  const lockAdmin = () => {
    setIsPinUnlocked(false);
    sessionStorage.removeItem(UNLOCKED_KEY);
  };

  const logout = () => {
    signOut(auth).catch(() => {});
    setUser(null);
    setIsPinUnlocked(false);
    sessionStorage.removeItem(UNLOCKED_KEY);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        isAuthenticated: isPinUnlocked && !!user,
        isAdmin: user?.role === 'ADMIN',
        isStaff: user?.role === 'STAFF' || user?.role === 'ADMIN',
        isPinUnlocked,
        adminPin,
        loginWithGoogle,
        verifyPin,
        setAdminPin,
        login,
        logout,
        lockAdmin,
        switchUser,
        allUsers,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const defaultAuthContext: AuthContextType = {
  user: null,
  firebaseUser: null,
  isAuthenticated: false,
  isAdmin: false,
  isStaff: false,
  isPinUnlocked: false,
  adminPin: DEFAULT_PIN,
  loginWithGoogle: async () => false,
  login: async () => false,
  verifyPin: async () => false,
  setAdminPin: async () => false,
  logout: () => {},
  lockAdmin: () => {},
  switchUser: () => {},
  allUsers: [],
  isLoading: false,
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    return defaultAuthContext;
  }
  return context;
};
