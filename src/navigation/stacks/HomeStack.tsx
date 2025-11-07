import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../../screens/home/HomeScreen';

/**
 * 🏠 Home Stack Param List
 * 
 * Stack del tab Home (CON tab bar y sidebar visibles):
 * - HomeMain: Pantalla principal con carruseles
 * - Aquí puedes agregar más pantallas que SÍ necesiten tabs:
 *   - Favorites: Lista de favoritos
 *   - Watchlist: Lista de "ver después"
 *   - etc...
 */
export type HomeStackParamList = {
  HomeMain: undefined;
  // Favorites: undefined;
  // Watchlist: undefined;
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      {/* Aquí agregas pantallas que SÍ necesitan tabs */}
    </Stack.Navigator>
  );
}
