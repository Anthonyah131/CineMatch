import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import AuthStack from './stacks/AuthStack';
import AppTabs from './tabs/AppTabs';
import { useAuth } from '../context/AuthContext';
import MovieDetailsScreen from '../screens/movies/MovieDetailsScreen';
import WriteReviewScreen from '../screens/movies/WriteReviewScreen';
import { ChatScreen } from '../screens/chats/ChatScreen';
import { MatchesScreen } from '../screens/matches/MatchesScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';
import PlansScreen from '../screens/settings/PlansScreen';
import type { TmdbMovieDetails } from '../types/tmdb.types';
import { COLORS } from '../config/colors';

/**
 * 🗂️ Root Stack Param List
 *
 * Navegación principal de la app:
 * - Auth: Stack de autenticación (OnBoarding, Login, SignUp)
 * - App: Tab Navigator (Game, Search, Home, Chats, Profile) CON tabs
 * - Pantallas adicionales SIN tabs:
 *   - MovieDetails: Detalles de película
 *   - WriteReview: Escribir review de película
 *   - Chat: Pantalla de chat individual
 *   - Matches: Pantalla de matches con otros usuarios
 *   - Settings: Configuración de la aplicación
 *   - Plans: Planes de suscripción
 */
export type RootStackParamList = {
  Auth: undefined;
  App: undefined;
  MovieDetails: { movieId: number };
  WriteReview: { movieDetails: TmdbMovieDetails };
  Chat: { chatId: string };
  Matches: undefined;
  Settings: undefined;
  Plans: undefined;
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
          {/* Tab Navigator - CON tabs */}
          <Stack.Screen name="App" component={AppTabs} />

          {/* Pantallas adicionales - SIN tabs */}
          <Stack.Screen
            name="MovieDetails"
            component={MovieDetailsScreen}
            options={{
              presentation: 'card',
              animation: 'slide_from_right',
            }}
          />
          <Stack.Screen
            name="WriteReview"
            component={WriteReviewScreen}
            options={{
              presentation: 'card',
              animation: 'slide_from_bottom',
            }}
          />
          <Stack.Screen
            name="Chat"
            component={ChatScreen}
            options={{
              presentation: 'card',
              animation: 'slide_from_right',
            }}
          />
          <Stack.Screen
            name="Matches"
            component={MatchesScreen}
            options={{
              presentation: 'card',
              animation: 'slide_from_right',
            }}
          />
          <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{
              presentation: 'card',
              animation: 'slide_from_right',
            }}
          />
          <Stack.Screen
            name="Plans"
            component={PlansScreen}
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
    backgroundColor: COLORS.background,
  },
});
