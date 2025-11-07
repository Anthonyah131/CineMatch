import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import AuthStack from './stacks/AuthStack';
import AppTabs from './tabs/AppTabs';
import { useAuth } from '../context/AuthContext';
import MovieDetailsScreen from '../screens/movies/MovieDetailsScreen';

/**
 * 🗂️ Root Stack Param List
 *
 * Navegación principal de la app:
 * - Auth: Stack de autenticación (OnBoarding, Login, SignUp)
 * - App: Tab Navigator (Home, Search, Profile) con sidebar
 * - Pantallas adicionales SIN tabs ni sidebar:
 *   - MovieDetails: Detalles de película
 *   - ... aquí agregas más pantallas que no necesiten tabs
 */
export type RootStackParamList = {
  Auth: undefined;
  App: undefined;
  MovieDetails: { movieId: number };
  // Aquí puedes agregar más pantallas sin tabs:
  // TVShowDetails: { tvShowId: number };
  // PersonDetails: { personId: number };
  // FullScreenVideo: { videoKey: string };
  // etc...
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const { user, isInitializing } = useAuth();

  // Mostrar loading mientras inicializa
  if (isInitializing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E69CA3" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        // Usuario autenticado
        <>
          {/* Tab Navigator - CON tabs y sidebar */}
          <Stack.Screen name="App" component={AppTabs} />

          {/* Pantallas adicionales - SIN tabs ni sidebar */}
          <Stack.Screen
            name="MovieDetails"
            component={MovieDetailsScreen}
            options={{
              presentation: 'card',
              animation: 'slide_from_right',
            }}
          />
          {/* Aquí agregas más pantallas sin tabs */}
        </>
      ) : (
        // Usuario no autenticado
        <Stack.Screen name="Auth" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0F0B0A',
  },
});
