import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { WEB_CLIENT_ID, BACKEND_URL } from '../config/firebase';
import { DEV_CONFIG } from '../config/api';
import { logRequest, logResponse, logError } from './api/interceptors';
import { clearStorage } from './storageService';

// Configurar Google Sign-In al iniciar el módulo
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
    // Configurar Google Sign-In si no está configurado
    configureGoogleSignIn();
    
    // En desarrollo: cerrar sesión previa para probar flujo completo
    if (DEV_CONFIG.AUTO_LOGOUT_ON_GOOGLE_SIGNIN) {
      console.log('🔄 [DEV] Limpiando sesión previa antes de Google Sign-In...');
      try {
        // 1. Revocar acceso de Google (más agresivo que signOut)
        // Esto fuerza a mostrar el selector de cuenta la próxima vez
        await GoogleSignin.revokeAccess();
        console.log('✅ [DEV] Acceso de Google revocado');
        
        // 2. Cerrar sesión de Firebase
        await auth().signOut();
        console.log('✅ [DEV] Sesión de Firebase cerrada');
        
        // 3. Limpiar storage local
        await clearStorage();
        console.log('✅ [DEV] Storage limpiado');
      } catch (logoutError) {
        console.log('⚠️ [DEV] Error al limpiar sesión:', logoutError);
      }
    }
    
    // 1. Hacer login con Google
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const userInfo = await GoogleSignin.signIn();

    // 2. Crear credencial de Firebase con el token de Google
    const googleCredential = auth.GoogleAuthProvider.credential(
      userInfo.data?.idToken ?? null
    );

    // 3. Hacer login en Firebase
    const firebaseUserCredential = await auth().signInWithCredential(
      googleCredential,
    );

    // 4. Obtener el token de Firebase
    const firebaseToken = await firebaseUserCredential.user.getIdToken();

    // 5. Enviar el token de Firebase al backend (login o registro automático)
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
  // El registro con Google es el mismo proceso que el login
  // El backend se encargará de crear el usuario si no existe
  return signInWithGoogle();
};

/**
 * Login con email y password (si lo necesitas en el futuro)
 */
export const signInWithEmail = async (
  email: string,
  password: string,
): Promise<AuthResponse> => {
  try {
    // 1. Login con Firebase
    const userCredential = await auth().signInWithEmailAndPassword(
      email,
      password,
    );

    // 2. Obtener token de Firebase
    const firebaseToken = await userCredential.user.getIdToken();

    // 3. Login con backend
    const backendResponse = await loginWithBackend(firebaseToken);

    return backendResponse;
  } catch (error: any) {
    console.error('Error en signInWithEmail:', error);

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
 * Registrar usuario con email y password (si lo necesitas en el futuro)
 */
export const registerWithEmail = async (
  email: string,
  password: string,
  name: string,
): Promise<AuthResponse> => {
  try {
    // 1. Crear usuario en Firebase
    const userCredential = await auth().createUserWithEmailAndPassword(
      email,
      password,
    );

    // 2. Actualizar el perfil con el nombre
    await userCredential.user.updateProfile({ displayName: name });

    // 3. Obtener token de Firebase
    const firebaseToken = await userCredential.user.getIdToken();

    // 4. Registrar con backend
    const backendResponse = await registerWithBackend(firebaseToken);

    return backendResponse;
  } catch (error: any) {
    console.error('Error en registerWithEmail:', error);

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
  const endpoint = '/auth/login';
  const url = `${BACKEND_URL}${endpoint}`;
  const requestBody = { firebaseToken };

  // Interceptor: Log request
  logRequest({
    method: 'POST',
    url: endpoint,
    body: requestBody,
  });

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      // Si el usuario no existe (404 o 401), intentar registrar
      if (response.status === 404 || response.status === 401) {
        console.log('Usuario no encontrado, intentando registrar...');
        return await registerWithBackend(firebaseToken);
      }
      
      const errorData = await response.json();
      const errorMessage = errorData.message || 'Error al iniciar sesión';
      
      // Interceptor: Log error
      logError({ url: endpoint, status: response.status, error: errorMessage });
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    
    // Interceptor: Log response
    logResponse({ url: endpoint, status: response.status, data });
    
    // El backend devuelve { token, user }, no { access_token, user }
    return {
      token: data.token, // ✅ CORREGIDO: era data.access_token
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
  const endpoint = '/auth/register';
  const url = `${BACKEND_URL}${endpoint}`;
  const requestBody = { firebaseToken };

  // Interceptor: Log request
  logRequest({
    method: 'POST',
    url: endpoint,
    body: requestBody,
  });

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData.message || 'Error al registrar usuario';
      
      // Interceptor: Log error
      logError({ url: endpoint, status: response.status, error: errorMessage });
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    
    // Interceptor: Log response
    logResponse({ url: endpoint, status: response.status, data });
    
    // El backend devuelve { token, user }, no { access_token, user }
    return {
      token: data.token, // ✅ CORREGIDO: era data.access_token
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
    // Cerrar sesión en Google
    try {
      await GoogleSignin.signOut();
    } catch (googleError) {
      console.log('No había sesión de Google activa:', googleError);
    }
    
    // Cerrar sesión en Firebase
    await auth().signOut();
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    throw new Error('Error al cerrar sesión');
  }
};/**
 * Obtener el token actual de la app (desde el almacenamiento local)
 */
export const getAppToken = async (): Promise<string | null> => {
  // Aquí deberías usar AsyncStorage o similar para guardar/recuperar el token del backend
  // Por ahora, obtenemos el token de Firebase
  const currentUser = auth().currentUser;
  if (currentUser) {
    return await currentUser.getIdToken();
  }
  return null;
};
