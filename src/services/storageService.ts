import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = '@cinematch_app_token';
const USER_KEY = '@cinematch_user';

/**
 * Guardar el token de la app
 */
export const saveAppToken = async (token: string): Promise<void> => {
  try {
    if (!token) {
      throw new Error('Token is required and cannot be undefined or null');
    }
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error('Error al guardar token:', error);
    throw error;
  }
};

/**
 * Obtener el token de la app
 */
export const getAppToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('Error al obtener token:', error);
    return null;
  }
};

/**
 * Eliminar el token de la app
 */
export const removeAppToken = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.error('Error al eliminar token:', error);
    throw error;
  }
};

/**
 * Guardar información del usuario
 */
export const saveUserData = async (user: any): Promise<void> => {
  try {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (error) {
    console.error('Error al guardar usuario:', error);
    throw error;
  }
};

/**
 * Obtener información del usuario
 */
export const getUserData = async (): Promise<any | null> => {
  try {
    const userData = await AsyncStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    return null;
  }
};

/**
 * Eliminar información del usuario
 */
export const removeUserData = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(USER_KEY);
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    throw error;
  }
};

/**
 * Limpiar todo el almacenamiento
 */
export const clearStorage = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
  } catch (error) {
    console.error('Error al limpiar almacenamiento:', error);
    throw error;
  }
};
