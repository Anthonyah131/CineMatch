import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, StyleSheet, View } from 'react-native';
import { COLORS } from '../../config/colors';
import FollowListScreen from '../../screens/profile/FollowListScreen';
import UserProfileScreen from '../../screens/profile/UserProfileScreen';
import MovieDetailsScreen from '../../screens/movies/MovieDetailsScreen';
import type { FollowListType } from '../../hooks/profile/useFollowList';

/**
 * 🔍 Search Stack Param List
 * 
 * Stack del tab Search (CON tab bar y sidebar visibles):
 * - SearchMain: Pantalla principal de búsqueda
 * - FollowList: Lista de seguidores/seguidos
 * - UserProfile: Perfil de otro usuario
 * - MovieDetails: Detalles de película
 */
export type SearchStackParamList = {
  SearchMain: undefined;
  FollowList: { type: FollowListType; userId: string };
  UserProfile: { userId: string };
  MovieDetails: { movieId: number };
};

const Stack = createNativeStackNavigator<SearchStackParamList>();

// Pantalla temporal de búsqueda
function SearchMainScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>🔍 Search Screen</Text>
      <Text style={styles.subtitle}>Pantalla de búsqueda (próximamente)</Text>
    </View>
  );
}

export default function SearchStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SearchMain" component={SearchMainScreen} />
      <Stack.Screen 
        name="FollowList" 
        component={FollowListScreen}
        options={{
          presentation: 'card',
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name="UserProfile" 
        component={UserProfileScreen}
        options={{
          presentation: 'card',
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name="MovieDetails" 
        component={MovieDetailsScreen}
        options={{
          presentation: 'card',
          animation: 'slide_from_right',
        }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});
