import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../../screens/home/HomeScreen';
import { MatchesScreen } from '../../screens/matches/MatchesScreen';

/**
 * 🏠 Home Stack Param List
 * 
 * Stack del tab Home (CON tab bar y sidebar visibles):
 * - HomeMain: Pantalla principal con carruseles
 * - Matches: Pantalla de matches con usuarios que vieron películas similares
 * - Aquí puedes agregar más pantallas que SÍ necesiten tabs:
 *   - Favorites: Lista de favoritos
 *   - Watchlist: Lista de "ver después"
 *   - etc...
 */
export type HomeStackParamList = {
  HomeMain: undefined;
  Matches: undefined;
  // Favorites: undefined;
  // Watchlist: undefined;
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="Matches" component={MatchesScreen} />
      {/* Aquí agregas pantallas que SÍ necesitan tabs */}
    </Stack.Navigator>
  );
}
