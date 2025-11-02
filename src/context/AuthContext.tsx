import React, { createContext, useContext, useEffect, useState } from 'react';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import {
  signInWithGoogle as googleSignIn,
  registerWithGoogle as googleRegister,
  signInWithEmail as emailSignIn,
  registerWithEmail as emailRegister,
  signOut as authSignOut,
  AuthResponse,
} from '../services/authService';
import {
  saveAppToken,
  getAppToken,
  saveUserData,
  getUserData,
  clearStorage,
} from '../services/storageService';
import { authEvents } from '../services/api/apiClient';

interface AppUser {
  id: string;
  email: string;
  name: string;
  photoUrl?: string;
}

interface AuthContextType {
  user: AppUser | null;
  firebaseUser: FirebaseAuthTypes.User | null;
  appToken: string | null;
  isInitializing: boolean;
  isAuthenticating: boolean;
  loginWithGoogle: () => Promise<void>;
  registerWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  registerWithEmail: (
    email: string,
    password: string,
    name: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  firebaseUser: null,
  appToken: null,
  isInitializing: true,
  isAuthenticating: false,
  loginWithGoogle: async () => {},
  registerWithGoogle: async () => {},
  loginWithEmail: async () => {},
  registerWithEmail: async () => {},
  logout: async () => {},
  error: null,
  clearError: () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [firebaseUser, setFirebaseUser] =
    useState<FirebaseAuthTypes.User | null>(null);
  const [appToken, setAppToken] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Inicializar: cargar datos guardados y escuchar cambios de Firebase
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Cargar datos guardados
        const savedToken = await getAppToken();
        const savedUser = await getUserData();

        if (savedToken && savedUser) {
          setAppToken(savedToken);
          setUser(savedUser);
        }
      } catch (err) {
        console.error('Error al inicializar auth:', err);
      } finally {
        setIsInitializing(false);
      }
    };

    initAuth();

    // Escuchar cambios en Firebase
    const unsubscribe = auth().onAuthStateChanged(authUser => {
      if (authUser) {
        console.log('🔐 Firebase Auth: Usuario autenticado -', authUser.email);
      } else {
        console.log('🔓 Firebase Auth: Usuario no autenticado');
      }
      
      setFirebaseUser(authUser);

      // Si no hay usuario de Firebase, limpiar todo
      if (!authUser) {
        setUser(null);
        setAppToken(null);
      }
    });

    // Escuchar evento de forceLogout del interceptor de API
    const handleForceLogout = async () => {
      console.log('🔐 Logout forzado por token expirado');
      await logout();
    };

    authEvents.on('forceLogout', handleForceLogout);

    return () => {
      unsubscribe();
      authEvents.off('forceLogout', handleForceLogout);
    };
  }, []);

  const handleAuthResponse = async (response: AuthResponse) => {
    // Guardar token y datos del usuario
    await saveAppToken(response.token);
    await saveUserData(response.user);

    setAppToken(response.token);
    setUser(response.user);
    setError(null);
  };

  const loginWithGoogle = async () => {
    try {
      setIsAuthenticating(true);
      setError(null);
      const response = await googleSignIn();
      await handleAuthResponse(response);
    } catch (error: any) {
      setError(error.message || 'Error al iniciar sesión con Google');
      throw error;
    } finally {
      setIsAuthenticating(false);
    }
  };

  const registerWithGoogle = async () => {
    try {
      setIsAuthenticating(true);
      setError(null);
      const response = await googleRegister();
      await handleAuthResponse(response);
    } catch (error: any) {
      console.error('Error en registerWithGoogle:', error);
      setError(error.message || 'Error al registrar con Google');
      throw error;
    } finally {
      setIsAuthenticating(false);
    }
  };

  const loginWithEmail = async (email: string, password: string) => {
    try {
      setIsAuthenticating(true);
      setError(null);
      const response = await emailSignIn(email, password);
      await handleAuthResponse(response);
    } catch (error: any) {
      console.error('Error en loginWithEmail:', error);
      setError(error.message || 'Error al iniciar sesión');
      throw error;
    } finally {
      setIsAuthenticating(false);
    }
  };

  const registerWithEmail = async (
    email: string,
    password: string,
    name: string,
  ) => {
    try {
      setIsAuthenticating(true);
      setError(null);
      const response = await emailRegister(email, password, name);
      await handleAuthResponse(response);
    } catch (error: any) {
      console.error('Error en registerWithEmail:', error);
      setError(error.message || 'Error al registrar');
      throw error;
    } finally {
      setIsAuthenticating(false);
    }
  };

  const logout = async () => {
    try {
      setIsAuthenticating(true);
      await authSignOut();
      await clearStorage();
      setUser(null);
      setAppToken(null);
      setFirebaseUser(null);
      setError(null);
    } catch (error: any) {
      console.error('Error al cerrar sesión:', error);
      setError(error.message || 'Error al cerrar sesión');
      throw error;
    } finally {
      setIsAuthenticating(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        appToken,
        isInitializing,
        isAuthenticating,
        loginWithGoogle,
        registerWithGoogle,
        loginWithEmail,
        registerWithEmail,
        logout,
        error,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
