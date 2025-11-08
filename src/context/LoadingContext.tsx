'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import { Modal, View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { COLORS } from '../config/colors';

// Define el tipo del contexto
interface LoadingContextType {
  isLoading: boolean;
  message: string;
  showLoading: (message?: string) => void;
  hideLoading: () => void;
}

// Crea el contexto
const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

// Props del Provider
interface LoadingProviderProps {
  children: ReactNode;
}

// Provider del contexto
export function LoadingProvider({ children }: LoadingProviderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('Cargando...');

  const showLoading = (customMessage = 'Cargando...') => {
    setMessage(customMessage);
    setIsLoading(true);
  };

  const hideLoading = () => {
    setIsLoading(false);
  };

  return (
    <LoadingContext.Provider
      value={{ isLoading, message, showLoading, hideLoading }}
    >
      {children}

      {/* Modal de carga */}
      <Modal
        transparent={true}
        animationType="fade"
        visible={isLoading}
        statusBarTranslucent
      >
        <View style={styles.overlay}>
          <View style={styles.container}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.message}>{message}</Text>
          </View>
        </View>
      </Modal>
    </LoadingContext.Provider>
  );
}

// Hook personalizado para usar el contexto
export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading debe ser usado dentro de un LoadingProvider');
  }
  return context;
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 11, 10, 0.85)', // Negro cálido con opacidad
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    minWidth: 200,
    elevation: 8,
  },
  message: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.text,
    textAlign: 'center',
    fontWeight: '500',
  },
});
