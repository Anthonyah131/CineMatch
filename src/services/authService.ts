import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { WEB_CLIENT_ID } from '../config/firebase';
import { DEV_CONFIG, BACKEND_URL } from '../config/api';
import { clearStorage } from './storageService';

let isGoogleConfigured = false;

const configureGoogleSignIn = () => {
  if (!isGoogleConfigured) {
    GoogleSignin.configure({
      webClientId: WEB_CLIENT_ID,
      offlineAccess: true,
    });
    isGoogleConfigured = true;
  }
};

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    photoUrl?: string;
  };
}

/**
 * Login con Google usando Firebase y obtener token del backend
 */
export const signInWithGoogle = async (): Promise<AuthResponse> => {
  try {
    configureGoogleSignIn();

    if (DEV_CONFIG.AUTO_LOGOUT_ON_GOOGLE_SIGNIN) {
      try {
        await GoogleSignin.revokeAccess();
        await auth().signOut();
        await clearStorage();
      } catch (logoutError) {
        console.log('⚠️ [DEV] Error al limpiar sesión:', logoutError);
      }
    }

    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const userInfo = await GoogleSignin.signIn();

    const googleCredential = auth.GoogleAuthProvider.credential(
      userInfo.data?.idToken ?? null,
    );

    const firebaseUserCredential = await auth().signInWithCredential(
      googleCredential,
    );

    const firebaseToken = await firebaseUserCredential.user.getIdToken();

    const backendResponse = await loginWithBackend(firebaseToken);

    return backendResponse;
  } catch (error: any) {
    if (error.code === 'SIGN_IN_CANCELLED') {
      throw new Error('Login cancelado por el usuario');
    } else if (error.code === 'IN_PROGRESS') {
      throw new Error('Login ya en progreso');
    } else if (error.code === 'PLAY_SERVICES_NOT_AVAILABLE') {
      throw new Error('Google Play Services no disponible');
    }

    throw new Error('Error al iniciar sesión con Google');
  }
};

/**
 * Registrar usuario con Google
 */
export const registerWithGoogle = async (): Promise<AuthResponse> => {
  return signInWithGoogle();
};

/**
 * Login con email y password
 */
export const signInWithEmail = async (
  email: string,
  password: string,
): Promise<AuthResponse> => {
  try {
    const userCredential = await auth().signInWithEmailAndPassword(
      email,
      password,
    );

    const firebaseToken = await userCredential.user.getIdToken();
    const backendResponse = await loginWithBackend(firebaseToken);

    return backendResponse;
  } catch (error: any) {
    if (error.code === 'auth/user-not-found') {
      throw new Error('Usuario no encontrado');
    } else if (error.code === 'auth/wrong-password') {
      throw new Error('Contraseña incorrecta');
    } else if (error.code === 'auth/invalid-email') {
      throw new Error('Email inválido');
    }

    throw new Error('Error al iniciar sesión');
  }
};

/**
 * Registrar usuario con email y password
 */
export const registerWithEmail = async (
  email: string,
  password: string,
  name: string,
): Promise<AuthResponse> => {
  try {
    const userCredential = await auth().createUserWithEmailAndPassword(
      email,
      password,
    );

    await userCredential.user.updateProfile({ displayName: name });

    const firebaseToken = await userCredential.user.getIdToken();
    const backendResponse = await registerWithBackend(firebaseToken);

    return backendResponse;
  } catch (error: any) {
    if (error.code === 'auth/email-already-in-use') {
      throw new Error('El email ya está en uso');
    } else if (error.code === 'auth/weak-password') {
      throw new Error('La contraseña es muy débil');
    } else if (error.code === 'auth/invalid-email') {
      throw new Error('Email inválido');
    }

    throw new Error('Error al registrar usuario');
  }
};

/**
 * Login con el backend usando el firebaseToken
 */
const loginWithBackend = async (
  firebaseToken: string,
): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${BACKEND_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ firebaseToken }),
    });

    if (!response.ok) {
      if (response.status === 404 || response.status === 401) {
        return await registerWithBackend(firebaseToken);
      }

      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al iniciar sesión');
    }

    const data = await response.json();

    return {
      token: data.token,
      user: {
        id: data.user.uid,
        email: data.user.email,
        name: data.user.displayName || data.user.email,
        photoUrl: data.user.photoURL,
      },
    };
  } catch (error: any) {
    throw error;
  }
};

/**
 * Registrar usuario en el backend usando el firebaseToken
 */
const registerWithBackend = async (
  firebaseToken: string,
): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${BACKEND_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ firebaseToken }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al registrar usuario');
    }

    const data = await response.json();

    return {
      token: data.token,
      user: {
        id: data.user.uid,
        email: data.user.email,
        name: data.user.displayName || data.user.email,
        photoUrl: data.user.photoURL,
      },
    };
  } catch (error: any) {
    throw new Error(error.message || 'Error de conexión con el servidor');
  }
};

/**
 * Cerrar sesión
 */
export const signOut = async (): Promise<void> => {
  try {
    try {
      await GoogleSignin.signOut();
    } catch (googleError) {
      console.log('No había sesión de Google activa');
    }

    await auth().signOut();
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    throw new Error('Error al cerrar sesión');
  }
};

/**
 * Obtener el token actual de Firebase
 */
export const getAppToken = async (): Promise<string | null> => {
  const currentUser = auth().currentUser;
  if (currentUser) {
    return await currentUser.getIdToken();
  }
  return null;
};
